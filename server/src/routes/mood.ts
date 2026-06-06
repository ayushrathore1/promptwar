import { Router, Request, Response } from 'express';
import { MoodEntry } from '../models/MoodEntry';
import { Student } from '../models/Student';
import { authMiddleware, requireStudentMatch } from '../middlewares/auth';

const router = Router();

// POST /api/moods — Log a new mood entry (IDOR validation: body studentId matches token studentId)
router.post('/', authMiddleware, requireStudentMatch('studentId'), async (req: Request, res: Response) => {
  try {
    const { studentId, moodScore, moodLabel, trigger, note } = req.body;

    if (!studentId || !moodScore || !moodLabel || !trigger) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const entry = await MoodEntry.create({
      studentId,
      moodScore,
      moodLabel,
      trigger,
      note: note || '',
    });

    // Update student streak
    const student = await Student.findById(studentId);
    if (student) {
      const now = new Date();
      const lastCheckIn = student.lastCheckIn;

      if (lastCheckIn) {
        const diffHours = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);
        if (diffHours < 48) {
          // Within streak window — increment
          student.streak += 1;
        } else {
          // Streak broken — reset to 1
          student.streak = 1;
        }
      } else {
        student.streak = 1;
      }

      student.lastCheckIn = now;
      await student.save();
    }

    res.status(201).json(entry);
  } catch (error) {
    console.error('Mood log error:', error);
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

// GET /api/moods/:studentId — Get mood history (last 14 days; IDOR validation: param studentId matches token studentId)
router.get('/:studentId', authMiddleware, requireStudentMatch('studentId'), async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const moods = await MoodEntry.find({
      studentId,
      createdAt: { $gte: fourteenDaysAgo },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(moods);
  } catch (error) {
    console.error('Fetch moods error:', error);
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
});

export default router;
