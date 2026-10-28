import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authorize } from '../src/middleware/roleMiddleware';

describe('Security & Authentication Unit Tests', () => {
  const secret = 'test-secret-key-12345';

  describe('Password Hashing & Cryptography', () => {
    it('should hash passwords using bcrypt with salt rounds >= 10', async () => {
      const password = 'StrongPassword123!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2')).toBe(true);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('WrongPassword!', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Payload & Session Integrity', () => {
    it('should issue and properly decode token with organization and role claims', () => {
      const payload = {
        id: '60c72b2f9b1d8b2bad8e8912',
        role: 'ADMIN',
        organizationId: '60c72b2f9b1d8b2bad8e8911',
        requiresPasswordChange: false
      };

      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, secret) as any;

      expect(decoded.id).toBe(payload.id);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.organizationId).toBe(payload.organizationId);
      expect(decoded.requiresPasswordChange).toBe(false);
    });

    it('should reject tampered or invalid JWT signatures', () => {
      const payload = { id: '123', role: 'ADMIN' };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const wrongSecret = 'hacker-fake-key-54321';

      expect(() => {
        jwt.verify(token, wrongSecret);
      }).toThrow();
    });
  });

  describe('Role-Based Access Control (RBAC) Middleware', () => {
    it('should permit access when user has matching role', () => {
      const middleware = authorize('ADMIN', 'LAWYER');
      const req: any = { user: { role: 'LAWYER' } };
      let nextCalled = false;
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = () => { nextCalled = true; };

      middleware(req, res, next);
      expect(nextCalled).toBe(true);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject access with 403 Forbidden when user lacks required role', () => {
      const middleware = authorize('ADMIN');
      const req: any = { user: { role: 'CASE_WORKER' } };
      let nextCalled = false;
      let statusCode = 0;
      let responseBody: any = null;

      const res: any = {
        status: jest.fn((code) => {
          statusCode = code;
          return res;
        }),
        json: jest.fn((body) => {
          responseBody = body;
          return res;
        })
      };
      const next = () => { nextCalled = true; };

      middleware(req, res, next);
      expect(nextCalled).toBe(false);
      expect(statusCode).toBe(403);
      expect(responseBody.message).toContain('is not authorized');
    });

    it('should reject access with 403 when user is unauthenticated or user object is missing', () => {
      const middleware = authorize('ADMIN');
      const req: any = {};
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      middleware(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});

