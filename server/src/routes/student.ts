import { Router, Request, Response } from 'express';
import { Student } from '../models/Student';
import { authMiddleware, requireStudentMatch } from '../middlewares/auth';

const router = Router();

// GET /api/students — List all students (for demo profile switching, restricted to authenticated users)
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const students = await Student.find().lean();
    res.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/students/:id — Get single student profile (IDOR protection: must match authenticated student)
router.get('/:id', authMiddleware, requireStudentMatch('id'), async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(student);
  } catch (error) {
    console.error('Fetch student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

export default router;
