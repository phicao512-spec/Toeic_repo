import request from 'supertest';
import { app } from '../../app';

describe('health route', () => {
  it('returns service health payload', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(typeof response.body.data.timestamp).toBe('string');
  });
});