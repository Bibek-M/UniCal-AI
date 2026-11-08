import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../middleware.ts';
import { processRagChat } from './ragService.ts';
import { getGroqApiKey } from './groqClient.ts';
import type { RagChatRequest } from './types.ts';

const ragRouter = Router();

/**
 * POST /api/rag/chat
 * Dispatches a student question to the Groq-powered RAG pipeline
 */
ragRouter.post('/chat', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { message, history } = req.body as RagChatRequest;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({
        success: false,
        message: 'A valid question or message is required.',
      });
      return;
    }

    const response = await processRagChat(userId, message, history);
    res.status(200).json(response);
  } catch (error: any) {
    console.error('[RAG Route Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process RAG chat request with Groq',
      error: error.message || 'Unknown RAG error',
    });
  }
});

/**
 * GET /api/rag/status
 * Health check for Groq and RAG configuration
 */
ragRouter.get('/status', (req: Request, res: Response): void => {
  try {
    const key = getGroqApiKey();
    const maskedKey = key.slice(0, 6) + '...' + key.slice(-4);
    res.status(200).json({
      configured: true,
      provider: 'Groq Cloud',
      defaultModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      keyPreview: maskedKey,
    });
  } catch (err: any) {
    res.status(500).json({
      configured: false,
      error: err.message,
    });
  }
});

export { ragRouter };

