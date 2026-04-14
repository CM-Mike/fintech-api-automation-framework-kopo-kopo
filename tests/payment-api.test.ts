import request from 'supertest';
import express from 'express';

// We create a "Mock Server" inside the test so it doesn't need the internet
const app = express();
app.use(express.json());

// This mimics Kopo Kopo's API behavior
app.post('/v1/payments/initiate', (req, res) => {
  const { amount, phoneNumber } = req.body;
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  if (phoneNumber === 'not-a-phone-number') return res.status(400).json({ message: 'Invalid phone' });

  res.status(201).json({ id: 'k2_tx_12345', status: 'pending' });
});

describe('Fintech API: Payment Initiation (Mocked)', () => {
  const validToken = 'Bearer sk_test_123';
  const validPayload = { phoneNumber: '254712345678', amount: 1000 };

  it('should successfully initiate a payment', async () => {
    const res = await request(app)
      .post('/v1/payments/initiate')
      .set('Authorization', validToken)
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
  });

  it('should return 401 if token is missing', async () => {
    const res = await request(app).post('/v1/payments/initiate').send(validPayload);
    expect(res.status).toBe(401);
  });

  it('should return 400 for negative amounts', async () => {
    const res = await request(app)
      .post('/v1/payments/initiate')
      .set('Authorization', validToken)
      .send({ ...validPayload, amount: -50 });
    expect(res.status).toBe(400);
  });
});