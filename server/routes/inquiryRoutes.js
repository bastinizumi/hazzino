import express from 'express';
import mongoose from 'mongoose';
import { Inquiry } from '../models/Inquiry.js';

const router = express.Router();

// In-memory fallback repository when MongoDB daemon is not locally running
const fallbackInquiries = [];

// POST /api/inquiries — Create a new bespoke spec sheet request
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, product, material, color, finish, customRequirement } = req.body;

    if (!name || !phone || !email || !product) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, email, and product are required.',
      });
    }

    let savedRecord = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const inquiryDoc = new Inquiry({
          name,
          phone,
          email,
          product,
          material: material || 'Natural Wood',
          color: color || 'Warm Ivory',
          finish: finish || 'Matte',
          customRequirement: customRequirement || '',
        });
        savedRecord = await inquiryDoc.save();
      } catch (dbErr) {
        console.warn('MongoDB write issue, falling back to memory store:', dbErr.message);
      }
    }

    if (!savedRecord) {
      savedRecord = {
        _id: 'inq_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        name,
        phone,
        email,
        product,
        material: material || 'Natural Wood',
        color: color || 'Warm Ivory',
        finish: finish || 'Matte',
        customRequirement: customRequirement || '',
        createdAt: new Date().toISOString(),
        storage: 'local_memory_fallback',
      };
      fallbackInquiries.unshift(savedRecord);
    }

    return res.status(201).json({
      success: true,
      message: 'Bespoke specification request received successfully.',
      data: savedRecord,
    });
  } catch (error) {
    console.error('Inquiry error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process bespoke specification request.',
      error: error.message,
    });
  }
});

// GET /api/inquiries — List inquiries
router.get('/', async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const records = await Inquiry.find().sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, count: records.length, data: records });
    }
    return res.json({ success: true, count: fallbackInquiries.length, data: fallbackInquiries });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
