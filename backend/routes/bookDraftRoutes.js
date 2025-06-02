const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BookDraft = require('../models/BookDraft');
const Book = require('../models/Book');

// Get all drafts for the authenticated author
router.get('/', auth(['author']), async (req, res) => {
  try {
    const drafts = await BookDraft.find({ author: req.user._id })
      .populate('book', 'name genre')
      .sort({ lastModified: -1 });
    res.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ 
      message: 'Error fetching drafts', 
      error: error.message 
    });
  }
});

// Get a specific draft by ID
router.get('/:id', auth(['author']), async (req, res) => {
  try {
    const draft = await BookDraft.findOne({ 
      _id: req.params.id,
      author: req.user._id
    }).populate('book', 'name genre');
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    
    res.json(draft);
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({ 
      message: 'Error fetching draft', 
      error: error.message 
    });
  }
});

// Create a new draft
router.post('/', auth(['author']), async (req, res) => {
  try {
    const { title, content, bookId, notes, tags } = req.body;
    
    // Validate input
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Create new draft
    const draft = new BookDraft({
      title,
      content: content || '',
      book: bookId || null,
      author: req.user._id,
      notes: notes || '',
      tags: tags || []
    });
    
    await draft.save();
    res.status(201).json(draft);
  } catch (error) {
    console.error('Error creating draft:', error);
    res.status(500).json({ 
      message: 'Error creating draft', 
      error: error.message 
    });
  }
});

// Update a draft
router.put('/:id', auth(['author']), async (req, res) => {
  try {
    const { title, content, bookId, notes, tags } = req.body;
    
    // Find draft and check ownership
    const draft = await BookDraft.findOne({ 
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found or not authorized' });
    }
    
    // Update fields
    if (title) draft.title = title;
    if (content !== undefined) draft.content = content;
    if (bookId !== undefined) draft.book = bookId || null;
    if (notes !== undefined) draft.notes = notes;
    if (tags !== undefined) draft.tags = tags;
    
    // Update lastModified date
    draft.lastModified = Date.now();
    
    await draft.save();
    res.json(draft);
  } catch (error) {
    console.error('Error updating draft:', error);
    res.status(500).json({ 
      message: 'Error updating draft', 
      error: error.message 
    });
  }
});

// Delete a draft
router.delete('/:id', auth(['author']), async (req, res) => {
  try {
    // Find draft and check ownership
    const draft = await BookDraft.findOne({ 
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found or not authorized' });
    }
    
    await draft.remove();
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({ 
      message: 'Error deleting draft', 
      error: error.message 
    });
  }
});

// Get all drafts for a specific book
router.get('/book/:bookId', auth(['author']), async (req, res) => {
  try {
    // Check if book exists and belongs to author
    const book = await Book.findOne({
      _id: req.params.bookId,
      author: req.user._id
    });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found or not authorized' });
    }
    
    const drafts = await BookDraft.find({ 
      book: req.params.bookId,
      author: req.user._id
    }).sort({ lastModified: -1 });
    
    res.json(drafts);
  } catch (error) {
    console.error('Error fetching book drafts:', error);
    res.status(500).json({ 
      message: 'Error fetching book drafts', 
      error: error.message 
    });
  }
});

module.exports = router;
