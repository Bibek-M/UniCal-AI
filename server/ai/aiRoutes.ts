import { Router, type Request, type Response } from 'express';
import { authMiddleware } from '../middleware.ts';
import { extractEventFromDocument, extractEventFromText } from './geminiService.ts';
import type { ExtractEventRequest } from './types.ts';

const aiRouter = Router();

/**
 * POST /extract-pdf
 * Expects { pdfBase64: string, mimeType?: string, fileName?: string }
 * or { rawText: string }
 */
aiRouter.post('/extract-pdf', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { pdfBase64, mimeType = 'application/pdf', rawText, fileName } = req.body as ExtractEventRequest;

    if (!pdfBase64 && !rawText) {
      res.status(400).json({
        success: false,
        message: 'No document data provided. Please provide "pdfBase64" or "rawText".',
      });
      return;
    }

    if (pdfBase64) {
      // Validate supported mime types
      const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      const effectiveMime = allowedMimes.includes(mimeType) ? mimeType : 'application/pdf';

      console.log(`[AI Extractor] Processing document "${fileName || 'unnamed'}" (${effectiveMime})...`);
      const eventData = await extractEventFromDocument(pdfBase64, effectiveMime);

      res.status(200).json({
        success: true,
        message: 'Event details successfully extracted from document',
        fileName: fileName || undefined,
        event: eventData,
      });
      return;
    }

    if (rawText) {
      console.log('[AI Extractor] Processing raw document text...');
      const eventData = await extractEventFromText(rawText);

      res.status(200).json({
        success: true,
        message: 'Event details successfully extracted from text',
        event: eventData,
      });
      return;
    }
  } catch (error: any) {
    console.error('[AI Extractor Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract event data using AI',
      error: error.message || 'Unknown extraction error',
    });
  }
});

/**
 * POST /extract-text
 * Dedicated text extraction endpoint
 */
aiRouter.post('/extract-text', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawText } = req.body;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      res.status(400).json({
        success: false,
        message: 'Valid "rawText" string is required.',
      });
      return;
    }

    const eventData = await extractEventFromText(rawText);

    res.status(200).json({
      success: true,
      message: 'Event details successfully extracted from text',
      event: eventData,
    });
  } catch (error: any) {
    console.error('[AI Extractor Text Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract event data from text',
      error: error.message || 'Unknown extraction error',
    });
  }
});

export { aiRouter };

