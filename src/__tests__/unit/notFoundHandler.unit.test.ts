import { describe, it, expect, vi } from 'vitest';
import { notFoundHandler } from '../../middlewares/notFoundHandler.js';
import AppError from '../../utils/AppError.js';
import type { Request, Response, NextFunction } from 'express';

describe('notFoundHandler Middleware (Unit)', () => {
  it('should create an AppError with status 404 and pass it to next()', () => {
    // Arrange
    const mockReq = { originalUrl: '/missing-endpoint' } as Request;
    const mockRes = {} as Response;
    const mockNext: NextFunction = vi.fn();

    // Act
    notFoundHandler(mockReq, mockRes, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);
    const error = (mockNext as any).mock.calls[0][0];

    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain('/missing-endpoint');
  });
});
