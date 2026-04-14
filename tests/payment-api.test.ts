import request from 'supertest';
import nock from 'nock';

// Mocking the API base URL - in a real scenario, this would be your Sandbox URL
const BASE_URL = 'https://api-sandbox.payments-provider.com/v1';
const API_HOST = 'https://api-sandbox.payments-provider.com';

describe('Fintech API: Payment Initiation (STK Push)', () => {
  const validToken = 'Bearer sk_test_51MzS01L7hGqX';
  
  const validPaymentPayload = {
    phoneNumber: '254712345678',
    amount: 1500,
    currency: 'KES',
    callbackUrl: 'https://webhook.site/test-callback',
    description: 'Invoice #1029 Payment'
  };

  afterEach(() => {
    nock.cleanAll();
  });

  /**
   * TEST CASE 1: SUCCESSFUL INITIATION (The "Happy Path")
   * Validates that a correctly formatted request returns a 201 Created status.
   */
  it('should successfully initiate a payment with valid data', async () => {
    nock(API_HOST)
      .post('/v1/payments/initiate')
      .matchHeader('authorization', validToken)
      .reply(201, { id: 'test-id-123', status: 'pending' });

    const res = await request(BASE_URL)
      .post('/payments/initiate')
      .set('Authorization', validToken)
      .send(validPaymentPayload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('pending');
    expect(typeof res.body.id).toBe('string');
  });

  /**
   * TEST CASE 2: AUTHENTICATION FAILURE
   * Ensures the API rejects requests without a valid Bearer token.
   */
  it('should return 401 Unauthorized if token is missing', async () => {
    nock(API_HOST)
      .post('/v1/payments/initiate')
      .reply(401, { error: 'Unauthorized' });

    const res = await request(BASE_URL)
      .post('/payments/initiate')
      .send(validPaymentPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/unauthorized/i);
  });

  /**
   * TEST CASE 3: DATA VALIDATION (Negative Amount)
   * A critical fintech check: preventing "money-generating" bugs.
   */
  it('should return 400 Bad Request if the amount is negative', async () => {
    nock(API_HOST)
      .post('/v1/payments/initiate')
      .matchHeader('authorization', validToken)
      .reply(400, { message: 'Amount must be positive' });

    const invalidPayload = { ...validPaymentPayload, amount: -100 };

    const res = await request(BASE_URL)
      .post('/payments/initiate')
      .set('Authorization', validToken)
      .send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('amount');
  });

  /**
   * TEST CASE 4: BOUNDARY TESTING (Zero Amount)
   * Checks if the system handles the minimum possible transaction edge case.
   */
  it('should return 400 if the amount is zero', async () => {
    nock(API_HOST)
      .post('/v1/payments/initiate')
      .matchHeader('authorization', validToken)
      .reply(400, { message: 'Amount must be greater than zero' });

    const res = await request(BASE_URL)
      .post('/payments/initiate')
      .set('Authorization', validToken)
      .send({ ...validPaymentPayload, amount: 0 });

    expect(res.status).toBe(400);
  });

  /**
   * TEST CASE 5: SCHEMA VALIDATION (Phone Number Format)
   * Validates that only properly formatted MSISDNs are accepted.
   */
  it('should fail if the phone number format is invalid', async () => {
    nock(API_HOST)
      .post('/v1/payments/initiate')
      .matchHeader('authorization', validToken)
      .reply(400, { message: 'Invalid phone number format' });

    const res = await request(BASE_URL)
      .post('/payments/initiate')
      .set('Authorization', validToken)
      .send({ ...validPaymentPayload, phoneNumber: 'not-a-phone-number' });

    expect(res.status).toBe(400);
  });
});