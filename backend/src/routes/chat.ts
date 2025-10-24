import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { orchestrator } from '../agents/graphOrchestrator';

const router = Router();

/**
 * @route   POST /api/chat
 * @desc    Send message to multi-agent system
 * @access  Private
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    // Validation
    if (!message || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Please provide a message',
      });
      return;
    }

    if (!userId || !userEmail) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    console.log(`📨 Processing message from user ${userId}: "${message}"`);

    // Process message through orchestrator
    const result = await orchestrator.processMessage(message, userId, userEmail);

    res.status(200).json({
      success: result.success,
      reply: result.message,
      agentType: result.agentType,
      bookingData: result.booking || null,
    });
  } catch (error: any) {
    console.error('Chat route error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error processing message',
    });
  }
});

/**
 * @route   GET /api/chat/status
 * @desc    Get agent system status
 * @access  Private
 */
router.get('/status', authenticate, (req: AuthRequest, res: Response): void => {
  const status = orchestrator.getStatus();
  res.status(200).json({
    success: true,
    ...status,
  });
});

export default router;
