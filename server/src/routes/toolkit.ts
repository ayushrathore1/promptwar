import { Router, Request, Response } from 'express';
import { MicroAction } from '../models/MicroAction';

const router = Router();

// GET /api/toolkit — Get micro-actions, optionally filtered by trigger
router.get('/', async (req: Request, res: Response) => {
  try {
    const { trigger } = req.query;
    const filter = trigger ? { trigger: trigger as string } : {};
    const actions = await MicroAction.find(filter).lean();
    res.json(actions);
  } catch (error) {
    console.error('Fetch toolkit error:', error);
    res.status(500).json({ error: 'Failed to fetch toolkit' });
  }
});

export default router;
