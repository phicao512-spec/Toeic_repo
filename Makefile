.PHONY: dev prod build stop logs backup seed migrate

# Development
dev:
	docker-compose -f docker-compose.dev.yml up

# Production
prod:
	docker-compose up -d

# Build images
build:
	docker-compose build

# Stop all services
stop:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Seed database
seed:
	docker-compose exec backend npx prisma db seed

# Run migrations
migrate:
	docker-compose exec backend npx prisma migrate deploy

# Clean everything
clean:
	docker-compose down -v
