# 🐳 Deployment Guide

## Self-Hosting with Docker Compose

### Prerequisites

1. **Server Requirements:**
   - OS: Ubuntu 22.04+ / Debian 12+ / any Linux with Docker
   - CPU: 2+ cores
   - RAM: 4GB minimum (8GB recommended)
   - Storage: 20GB+ (depends on content volume)
   - Network: Open ports 80, 443

2. **Software Required:**
   - Docker Engine 24+
   - Docker Compose v2.20+
   - Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/toeic-learning.git
cd toeic-learning
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# === Application ===
NODE_ENV=production
APP_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api

# === Database ===
POSTGRES_USER=toeic_user
POSTGRES_PASSWORD=<GENERATE_STRONG_PASSWORD>
POSTGRES_DB=toeic_learning
DATABASE_URL=postgresql://toeic_user:<PASSWORD>@postgres:5432/toeic_learning

# === Redis ===
REDIS_URL=redis://redis:6379

# === Auth ===
JWT_SECRET=<GENERATE_RANDOM_64_CHAR_STRING>
JWT_REFRESH_SECRET=<GENERATE_ANOTHER_RANDOM_STRING>
NEXTAUTH_SECRET=<GENERATE_ANOTHER_RANDOM_STRING>
NEXTAUTH_URL=https://yourdomain.com

# === MinIO ===
MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=<GENERATE_STRONG_PASSWORD>
MINIO_ENDPOINT=minio:9000
MINIO_BUCKET=toeic-assets

# === Email (optional) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# === SSL (if using custom certificates) ===
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

Generate secure passwords:
```bash
openssl rand -base64 48  # Run this for each password/secret
```

### Step 3: SSL Certificate (Optional but Recommended)

**Option A: Let's Encrypt (Free, Automatic)**
```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificates will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

**Option B: Self-Signed (Development)**
```bash
mkdir -p infrastructure/docker/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout infrastructure/docker/nginx/ssl/key.pem \
  -out infrastructure/docker/nginx/ssl/cert.pem
```

### Step 4: Build and Start

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Initialize Database

```bash
# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Seed initial data (vocabulary, sample questions, etc.)
docker-compose exec backend npx prisma db seed
```

### Step 6: Create Admin User

```bash
docker-compose exec backend node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password,
      role: 'ADMIN'
    }
  });
  console.log('Admin user created!');
}
main().finally(() => prisma.\$disconnect());
"
```

### Step 7: Verify

- Frontend: `http://yourdomain.com` or `https://yourdomain.com`
- API Health: `http://yourdomain.com/api/health`
- MinIO Console: `http://yourdomain.com:9001`

---

## Docker Compose Configuration

### Production (docker-compose.yml)

```yaml
version: '3.8'

services:
  # === Reverse Proxy ===
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./infrastructure/docker/nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: always
    networks:
      - toeic-network

  # === Frontend ===
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=${API_URL}
      - NEXTAUTH_URL=${APP_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - backend
    restart: always
    networks:
      - toeic-network

  # === Backend API ===
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
      - MINIO_ROOT_USER=${MINIO_ROOT_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
      - MINIO_BUCKET=${MINIO_BUCKET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: always
    networks:
      - toeic-network

  # === Database ===
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infrastructure/docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always
    networks:
      - toeic-network

  # === Cache ===
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always
    networks:
      - toeic-network

  # === File Storage ===
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ROOT_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9001:9001"  # MinIO Console (optional, can remove in production)
    restart: always
    networks:
      - toeic-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  minio_data:
    driver: local

networks:
  toeic-network:
    driver: bridge
```

---

## Nginx Configuration

```nginx
# infrastructure/docker/nginx/nginx.conf

events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:4000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # API requests
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # File upload limit
            client_max_body_size 50M;
        }

        # Frontend requests
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support (for HMR in dev)
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Static file caching
        location ~* \.(js|css|png|jpg|jpeg|webp|gif|ico|svg|woff|woff2)$ {
            proxy_pass http://frontend;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml;
        gzip_min_length 1000;
    }
}
```

---

## Backup & Restore

### Database Backup
```bash
# Manual backup
docker-compose exec postgres pg_dump -U toeic_user toeic_learning > backup_$(date +%Y%m%d).sql

# Automated daily backup (add to crontab)
0 3 * * * cd /path/to/toeic-learning && ./infrastructure/scripts/backup-db.sh
```

### Database Restore
```bash
cat backup_20260420.sql | docker-compose exec -T postgres psql -U toeic_user toeic_learning
```

### Full Backup (including files)
```bash
# Backup everything
tar -czf toeic-backup-$(date +%Y%m%d).tar.gz \
  backup_*.sql \
  .env \
  infrastructure/docker/nginx/ssl/

# Backup MinIO data
docker run --rm -v toeic-learning_minio_data:/data -v $(pwd):/backup \
  alpine tar -czf /backup/minio-backup.tar.gz /data
```

---

## Monitoring

### Health Checks
```bash
# Check all services
docker-compose ps

# Check API health
curl http://localhost:4000/api/health

# Check database connection
docker-compose exec backend npx prisma db execute --stdin <<< "SELECT 1"
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Resource Usage
```bash
docker stats
```

---

## Updating

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d

# Run new migrations if any
docker-compose exec backend npx prisma migrate deploy

# Check logs for errors
docker-compose logs -f --tail=50
```

---

## Cloud Deployment Options

| Platform | Method | Notes |
|----------|--------|-------|
| **VPS** (DigitalOcean, Vultr, Hetzner) | Docker Compose | Most flexible, cheapest |
| **AWS** | ECS + RDS + ElastiCache | Scalable, managed services |
| **Google Cloud** | Cloud Run + Cloud SQL | Serverless, pay-per-use |
| **Vercel + Railway** | Vercel (Frontend) + Railway (Backend + DB) | Easiest, free tier available |
| **Render** | Render Web Services | Simple, auto-deploy from Git |

### Recommended for Self-Host: Hetzner VPS
- **CX21**: 2 vCPU, 4GB RAM, 40GB SSD — ~€4.50/month
- Perfect for small to medium traffic
