import Chapter from '../models/chapterModel.js';
import fs from 'fs';
import path from 'path';
import redisClient from '../config/redisClient.js';
import crypto from 'crypto'; // for creating unique cache key

export const getAllChapters = async (req, res) => {
  try {
    const { class: classFilter, unit, status, weakChapters, subject, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (classFilter) filter.class = classFilter;
    if (unit) filter.unit = unit;
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (weakChapters !== undefined) filter.isWeakChapter = weakChapters === 'true';

    const cacheKey = `chapters:${crypto.createHash('md5').update(JSON.stringify(req.query)).digest('hex')}`;

    // Try fetching from Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Returned from Redis Cache');
      return res.json(JSON.parse(cachedData)); // return cached
    }

    // If not cached, hit MongoDB
    const total = await Chapter.countDocuments(filter);
    const chapters = await Chapter.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const result = { total, results: chapters.length, data: chapters };

    // Store in Redis for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
console.log('Cache MISS. Saved to Redis.');
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    return res.json(chapter);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const uploadChapters = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = path.resolve(req.file.path);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const chapters = JSON.parse(rawData);

    const inserted = [];
    const failed = [];

    for (let item of chapters) {
      try {
        const chapter = new Chapter(item);
        await chapter.validate();
        await chapter.save();
        inserted.push(chapter);
      } catch (err) {
        failed.push({ item, error: err.message });
      }
    }

    // Invalidate cache
    const keys = await redisClient.keys('chapters:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    console.log('Cache invalidated');

    return res.json({
      message: `${inserted.length} chapters uploaded successfully`,
      failedCount: failed.length,
      failed
    });
  } catch (err) {
    return res.status(500).json({ message: 'Upload error', error: err.message });
  }
};

