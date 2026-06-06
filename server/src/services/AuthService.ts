import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../models/User';
import { Student, StudentDocument } from '../models/Student';
import { EXAM_TYPES, ExamType } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'mindspace-dev-secret-2026';

export interface AuthSession {
  token: string;
  student: StudentDocument;
}

export class AuthService {
  /**
   * Registers a new student and user credentials.
   */
  public static async register(params: {
    email: string;
    password: string;
    name?: string;
    exam?: string;
    city?: string;
    background?: string;
  }): Promise<AuthSession> {
    const { email, password, name, exam, city, background } = params;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Validate exam type
    const examType = (exam || 'JEE') as ExamType;
    if (!EXAM_TYPES.includes(examType)) {
      throw new Error(`Invalid exam type. Must be one of: ${EXAM_TYPES.join(', ')}`);
    }

    // Create student profile first
    const student = await Student.create({
      name: name || email.split('@')[0],
      exam: examType,
      examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      city: city || 'India',
      streak: 0,
      lastCheckIn: null,
      background: background || `Preparing for ${examType}`,
    });

    // Create user linked to student
    const user = await User.create({
      email,
      password,
      studentId: student._id,
    });

    // Generate JWT
    const token = this.generateToken(String(user._id), String(student._id));

    return {
      token,
      student,
    };
  }

  /**
   * Log in an existing user.
   */
  public static async login(email: string, password: string): Promise<AuthSession> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const student = await Student.findById(user.studentId);
    if (!student) {
      throw new Error('Student profile not found');
    }

    const token = this.generateToken(String(user._id), String(student._id));

    return {
      token,
      student,
    };
  }

  /**
   * Demo Quick Login helper. Matches or creates a demo student & user.
   */
  public static async quickLogin(exam: ExamType): Promise<AuthSession> {
    if (!EXAM_TYPES.includes(exam)) {
      throw new Error(`Invalid exam type. Must be one of: ${EXAM_TYPES.join(', ')}`);
    }

    // Find the first demo student for this exam type
    let student = await Student.findOne({ exam });
    if (!student) {
      // Create fallback demo student if none found
      student = await Student.create({
        name: `Demo ${exam} Student`,
        exam,
        examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        city: 'Delhi',
        streak: 1,
        lastCheckIn: new Date(),
        background: `Demo student preparing for ${exam}`,
      });
    }

    // Find or create a demo user for this student
    let user = await User.findOne({ studentId: student._id });
    if (!user) {
      const safeName = student.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      user = await User.create({
        email: `${safeName}@mindspace.app`,
        password: 'mindspace123',
        studentId: student._id,
      });
    }

    const token = this.generateToken(String(user._id), String(student._id));

    return {
      token,
      student,
    };
  }

  /**
   * Verifies a token and retrieves the associated student.
   */
  public static async verifyToken(token: string): Promise<StudentDocument> {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; studentId: string };
    
    const student = await Student.findById(decoded.studentId);
    if (!student) {
      throw new Error('Student profile not found');
    }

    return student;
  }

  /**
   * Helper to sign JWT token.
   */
  private static generateToken(userId: string, studentId: string): string {
    return jwt.sign(
      { userId, studentId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}
