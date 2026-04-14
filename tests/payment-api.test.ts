/**
 * This test suite demonstrates "Unit Testing" of a payment validator.
 * In a real environment, this logic would be part of the API layer.
 */

// A simple validator function representing Kopo Kopo's business logic
const validatePaymentRequest = (payload: any, token?: string) => {
    if (!token) return { status: 401, error: 'Unauthorized' };
    if (payload.amount <= 0) return { status: 400, error: 'Invalid amount' };
    if (!payload.phoneNumber.startsWith('254')) return { status: 400, error: 'Invalid country code' };
    
    return { status: 201, data: { id: 'k2_tx_mock', status: 'pending' } };
};

describe('Fintech Logic: Payment Validation', () => {
    const validPayload = { phoneNumber: '254712345678', amount: 1000 };
    const validToken = 'Bearer sk_test_123';

    it('should return 201 for a valid Kenyan transaction', () => {
        const result = validatePaymentRequest(validPayload, validToken);
        expect(result.status).toBe(201);
        expect(result.data?.status).toBe('pending');
    });

    it('should catch unauthorized requests (Missing Token)', () => {
        const result = validatePaymentRequest(validPayload);
        expect(result.status).toBe(401);
        expect(result.error).toBe('Unauthorized');
    });

    it('should reject non-Kenyan numbers', () => {
        const invalidPayload = { ...validPayload, phoneNumber: '256123456' }; // Uganda
        const result = validatePaymentRequest(invalidPayload, validToken);
        expect(result.status).toBe(400);
        expect(result.error).toBe('Invalid country code');
    });

    it('should prevent negative transaction amounts', () => {
        const invalidPayload = { ...validPayload, amount: -50 };
        const result = validatePaymentRequest(invalidPayload, validToken);
        expect(result.status).toBe(400);
        expect(result.error).toBe('Invalid amount');
    });
});