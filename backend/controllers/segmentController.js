import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import { buildSegmentQuery } from '../utils/buildSegmentQuery.js';

// GET /api/segments
export const getSegments = async (req, res, next) => {
  try {
    const segments = await Segment.find().sort({ createdAt: -1 });
    res.json(segments);
  } catch (err) {
    next(err);
  }
};

// GET /api/segments/:id
export const getSegmentById = async (req, res, next) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) return res.status(404).json({ error: 'Segment not found' });
    res.json(segment);
  } catch (err) {
    next(err);
  }
};

// POST /api/segments/preview – preview matching customers before saving
export const previewSegment = async (req, res, next) => {
  try {
    const { rules, logic } = req.body;
    if (!rules || rules.length === 0) {
      const count = await Customer.countDocuments();
      return res.json({ count, sample: await Customer.find().limit(5) });
    }
    const query = buildSegmentQuery(rules, logic);
    const [count, sample] = await Promise.all([
      Customer.countDocuments(query),
      Customer.find(query).limit(5),
    ]);
    res.json({ count, sample });
  } catch (err) {
    next(err);
  }
};

// POST /api/segments
export const createSegment = async (req, res, next) => {
  try {
    const { name, description, rules, logic, createdByAI } = req.body;
    const query = rules && rules.length ? buildSegmentQuery(rules, logic) : {};
    const audienceSize = await Customer.countDocuments(query);
    const segment = new Segment({ name, description, rules, logic, createdByAI, audienceSize });
    await segment.save();
    res.status(201).json(segment);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/segments/:id
export const deleteSegment = async (req, res, next) => {
  try {
    await Segment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Segment deleted' });
  } catch (err) {
    next(err);
  }
};
