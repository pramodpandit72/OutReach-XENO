import express from 'express';
import { getSegments, getSegmentById, createSegment, previewSegment, deleteSegment } from '../controllers/segmentController.js';

const router = express.Router();

router.get('/', getSegments);
router.get('/:id', getSegmentById);
router.post('/preview', previewSegment);
router.post('/', createSegment);
router.delete('/:id', deleteSegment);

export default router;
