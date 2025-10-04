import request from 'supertest';
import { createServer } from '../server';

let app: any;

beforeAll(async () => {
  app = await createServer();
});

test('health endpoint', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});