import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { validate } from '../../../src/middleware/validation';

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
  body: jest.fn(() => jest.fn()),
  param: jest.fn(() => jest.fn()),
  query: jest.fn(() => jest.fn()),
}));

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('validate', () => {
    it('should call next() when validation passes', async () => {
      const mockValidationResult = {
        isEmpty: () => true,
        array: () => []
      };
      (validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

      const validationMiddleware = validate([]);
      await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should return 400 with validation errors when validation fails', async () => {
      const mockValidationResult = {
        isEmpty: () => false,
        array: () => [
          { msg: 'Email is required', param: 'email', location: 'body', type: 'field', path: 'email' },
          { msg: 'Name is required', param: 'name', location: 'body', type: 'field', path: 'name' }
        ]
      };
      (validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

      const validationMiddleware = validate([]);
      await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'name', message: 'Name is required' }
        ]
      });
    });

    it('should handle unknown field types correctly', async () => {
      const mockValidationResult = {
        isEmpty: () => false,
        array: () => [
          { msg: 'Unknown error', param: 'unknown', location: 'body', type: 'unknown', path: 'unknown' }
        ]
      };
      (validationResult as unknown as jest.Mock).mockReturnValue(mockValidationResult);

      const validationMiddleware = validate([]);
      await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Validation failed',
        errors: [
          { field: 'unknown', message: 'Unknown error' }
        ]
      });
    });
  });
}); 