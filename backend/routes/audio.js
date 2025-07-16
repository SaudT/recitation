const express = require('express');
const multer = require('multer');
const pool = require('../db');
const path = require('path');

const router = express.Router();

// Configure multer for memory storage (stores file in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is audio
    const allowedMimes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/aac',
      'audio/webm'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// POST /api/audio/upload - Upload audio file
router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { title, label, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const filename = `${Date.now()}-${originalname}`;

    // Insert audio file into database
    const query = `
      INSERT INTO audio_files (title, label, description, filename, original_name, file_size, mime_type, audio_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, label, description, filename, original_name, file_size, created_at
    `;

    const values = [title, label, description, filename, originalname, size, mimetype, buffer];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Audio file uploaded successfully',
      file: result.rows[0]
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio file' });
  }
});

// GET /api/audio/:id - Get audio file by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM audio_files WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    const audioFile = result.rows[0];
    
    // Set appropriate headers
    res.set({
      'Content-Type': audioFile.mime_type,
      'Content-Disposition': `inline; filename="${audioFile.original_name}"`,
      'Content-Length': audioFile.file_size
    });

    // Send the audio data
    res.send(audioFile.audio_data);

  } catch (error) {
    console.error('Retrieve error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio file' });
  }
});

// GET /api/audio - Get list of all audio files
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, title, label, description, filename, original_name, file_size, mime_type, created_at 
      FROM audio_files 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    
    res.json({
      files: result.rows
    });

  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio files list' });
  }
});

// GET /api/audio/search?title=... - Search audio files by title
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'Title query parameter is required' });
    }
    const query = `
      SELECT id, title, label, description, filename, original_name, file_size, mime_type, created_at
      FROM audio_files
      WHERE LOWER(title) LIKE LOWER($1)
      ORDER BY created_at DESC
    `;
    const values = [`%${title}%`];
    const result = await pool.query(query, values);
    res.json({ files: result.rows });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search audio files' });
  }
});

// DELETE /api/audio/:id - Delete audio file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM audio_files WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    res.json({ message: 'Audio file deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete audio file' });
  }
});

module.exports = router; 