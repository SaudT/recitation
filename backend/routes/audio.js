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
    
    // Also check file extension as fallback
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.webm'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Accept if MIME type is correct OR if file extension is correct
    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      console.log(`File accepted: ${file.originalname} (MIME: ${file.mimetype}, Ext: ${fileExtension})`);
      cb(null, true);
    } else {
      console.log(`File rejected: ${file.originalname} (MIME: ${file.mimetype}, Ext: ${fileExtension})`);
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
    const { surah, description } = req.body;
    if (!surah) {
      return res.status(400).json({ error: 'Surah is required' });
    }
    const filename = `${Date.now()}-${originalname}`;
    // Insert audio file into database
    const query = `
      INSERT INTO audio_files (surah, description, filename, original_name, file_size, mime_type, audio_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, surah, description, filename, original_name, file_size, created_at
    `;

    const values = [surah, description, filename, originalname, size, mimetype, buffer];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Audio file uploaded successfully',
      file: result.rows[0]
    });
    console.log(result.rows);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio file' });
  }
});

// GET /api/audio/search?surah=... - Search audio files by surah
router.get('/search', async (req, res) => {
  try {
    const { surah } = req.query;
    if (!surah) {
      return res.status(400).json({ error: 'Surah query parameter is required' });
    }
    const query = `
      SELECT id, surah, description, filename, original_name, file_size, mime_type, created_at
      FROM audio_files
      WHERE LOWER(surah) LIKE LOWER($1)
      ORDER BY created_at DESC
    `;
    const values = [`%${surah}%`];
    const result = await pool.query(query, values);
    res.json({ files: result.rows });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search audio files' });
  }
});

// GET /api/audio/:id - Get audio file by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching audio with ID:', id);

    const query = 'SELECT * FROM audio_files WHERE id = $1';
    const result = await pool.query(query, [id]);

    console.log('Query result:', result.rows);

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
    console.log("audioFile fetched", audioFile)

  } catch (error) {
    console.error('Retrieve error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio file' });
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