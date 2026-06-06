import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../services/AuthService';
import { User } from '../models/User';
import { Student } from '../models/Student';

// Mock mongoose models
vi.mock('../models/User', () => {
  return {
    User: {
      findOne: vi.fn(),
      create: vi.fn(),
    },
  };
});

vi.mock('../models/Student', () => {
  return {
    Student: {
      findOne: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
    },
  };
});

describe('AuthService unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should throw an error if email or password is empty', async () => {
      await expect(
        AuthService.register({ email: '', password: 'password123' })
      ).rejects.toThrow('Email and password are required');

      await expect(
        AuthService.register({ email: 'test@example.com', password: '' })
      ).rejects.toThrow('Email and password are required');
    });

    it('should throw an error if password is less than 6 characters', async () => {
      await expect(
        AuthService.register({ email: 'test@example.com', password: '123' })
      ).rejects.toThrow('Password must be at least 6 characters');
    });

    it('should throw an error for invalid exam types', async () => {
      // Mock findOne to return null (no user exists)
      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(
        AuthService.register({
          email: 'test@example.com',
          password: 'password123',
          exam: 'INVALID_EXAM',
        })
      ).rejects.toThrow('Invalid exam type');
    });
  });

  describe('login', () => {
    it('should throw an error if email or password is empty', async () => {
      await expect(AuthService.login('', 'password123')).rejects.toThrow(
        'Email and password are required'
      );
      await expect(AuthService.login('test@example.com', '')).rejects.toThrow(
        'Email and password are required'
      );
    });

    it('should throw an error if user is not found', async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(
        AuthService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('quickLogin', () => {
    it('should throw an error for invalid exam types', async () => {
      await expect(AuthService.quickLogin('INVALID_EXAM' as any)).rejects.toThrow(
        'Invalid exam type'
      );
    });
  });
});
