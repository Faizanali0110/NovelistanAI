import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Book, HelpCircle, Lightbulb, Edit3, List, Plus, Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List as ListIcon, ListOrdered, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Cookies from 'js-cookie';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// We'll use blob for exporting instead of docx library

// Define API base URL
import API_BASE_URL from '../config';

const BookWritingEditor = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [drafts, setDrafts] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAssistancePanel, setShowAssistancePanel] = useState(false);
  const [assistanceRequest, setAssistanceRequest] = useState('');
  const [assistanceResponse, setAssistanceResponse] = useState('');
  const [assistanceLoading, setAssistanceLoading] = useState(false);
  const [textSuggestion, setTextSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Refs
  const editorRef = useRef(null);
  const timeoutRef = useRef(null);
  
  // Get the author ID from cookies
  const authorId = Cookies.get('authorId');
  const token = Cookies.get('token');
  
  // Initialize with draft data or create new draft
  useEffect(() => {
    const fetchDraftData = async () => {
      if (draftId) {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/api/book-drafts/${draftId}`, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : ''
            }
          });
          
          const draft = response.data;
          setTitle(draft.title || '');
          setContent(draft.content || '');
          setNotes(draft.notes || '');
          setTags(draft.tags || []);
          setSelectedBookId(draft.book || '');
          setLoading(false);
        } catch (err) {
          console.error('Error fetching draft:', err);
          setError('Failed to fetch draft');
          setLoading(false);
        }
      }
    };
    
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/authors/${authorId}/books`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        setBooks(response.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };
    
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/book-drafts`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        setDrafts(response.data);
      } catch (err) {
        console.error('Error fetching drafts:', err);
      }
    };
    
    fetchDraftData();
    fetchBooks();
    fetchDrafts();
  }, [draftId, authorId, token]);
  
  // Handle saving the draft
  const saveDraft = async () => {
    try {
      // Validate required fields
      if (!title.trim()) {
        setError('Draft title is required');
        return;
      }
      
      setSaving(true);
      setError('');
      
      console.log('Saving draft with content length:', content?.length || 0);
      
      const draftData = {
        title,
        content,
        bookId: selectedBookId || null,
        notes,
        tags
      };
      
      let response;
      
      if (draftId) {
        // Update existing draft
        console.log(`Updating draft with ID: ${draftId}`);
        response = await axios.put(`${API_BASE_URL}/api/book-drafts/${draftId}`, draftData, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        console.log('Update response:', response.data);
      } else {
        // Create new draft
        console.log('Creating new draft');
        response = await axios.post(`${API_BASE_URL}/api/book-drafts`, draftData, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        console.log('Create response:', response.data);
        
        // Redirect to the edit page for the new draft
        if (response.data && response.data._id) {
          // Update the draftId state and URL
          setDraftId(response.data._id);
          navigate(`/AuthorHandling/writing/${response.data._id}`, { replace: true });
          // Add the new draft to the drafts list to ensure it appears immediately
          setDrafts([response.data, ...drafts]);
          setSuccessMessage('Draft saved successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      }
      
      setSuccessMessage('Draft saved successfully');
      setSaving(false);
      
      // Refresh drafts list
      console.log('Refreshing drafts list');
      const updatedDraftsResponse = await axios.get(`${API_BASE_URL}/api/book-drafts`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      setDrafts(updatedDraftsResponse.data);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err.response?.data?.message || 'Failed to save draft. Please try again.');
      setSaving(false);
    }
  };
  
  // Handle rich text input changes
  const handleContentChange = (value) => {
    // React Quill passes the HTML content directly, not an event
    setContent(value);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to generate suggestions after typing stops
    if (e.target.value.trim().length > 5) {
      timeoutRef.current = setTimeout(() => {
        generateTextSuggestion();
      }, 2000); // Wait 2 seconds after typing stops
    }
  };
  
  // Define rich text editor modules and formats
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'script', 'align', 'direction',
    'background'
  ];

  // Handle content change and set up timer for suggestion
  useEffect(() => {
    // Only trigger AI suggestions after initial loading is complete
    if (loading) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout for generating suggestions
    if (content && content.trim().length > 20) {
      timeoutRef.current = setTimeout(() => {
        generateTextSuggestion();
      }, 2000); // Wait 2 seconds after typing stops
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, loading]);

  // Generate text suggestions as the author writes
  const generateTextSuggestion = async () => {
    try {
      // Extract plain text from HTML content for AI processing using DOMParser
      let textContent = "";
      
      if (content) {
        // First try with DOMParser if in browser environment
        if (typeof DOMParser !== 'undefined') {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            textContent = doc.body.textContent || "";
          } catch (error) {
            console.error('Error parsing HTML with DOMParser:', error);
            // Fallback to regex if DOMParser fails
            textContent = content.replace(/<[^>]+>/g, ' ').trim();
          }
        } else {
          // Fallback to regex if DOMParser is not available
          textContent = content.replace(/<[^>]+>/g, ' ').trim();
        }
      }
      
      // Only generate suggestions if we have reasonable content
      if (!textContent || textContent.length < 20) return;
      
      setSuggestionsLoading(true);
      setShowSuggestion(false);
      
      console.log('Generating suggestion for text:', textContent.slice(-200));
      
      const response = await axios.post(`${API_BASE_URL}/api/author-tools/text-suggestion`, {
        currentText: textContent,
        request: 'Please suggest a continuation for this text',
        bookId: selectedBookId || null
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.suggestion) {
        console.log('Received suggestion:', response.data.suggestion);
        setTextSuggestion(response.data.suggestion);
        setShowSuggestion(true);
      } else {
        console.log('No suggestion received from API');
      }
      
      setSuggestionsLoading(false);
    } catch (err) {
      console.error('Error generating suggestion:', err);
      setSuggestionsLoading(false);
    }
  };
  
  // Accept the suggestion and add it to the content
  const acceptSuggestion = () => {
    if (textSuggestion) {
      // For React Quill, we need to append the text suggestion to the existing HTML content
      // We're adding a space before the suggestion for better readability
      setContent(content + ' ' + textSuggestion);
      setShowSuggestion(false);
      setTextSuggestion('');
      
      // Log for debugging
      console.log('Accepted suggestion, new content length:', (content + ' ' + textSuggestion).length);
    }
  };
  
  // Dismiss the suggestion
  const dismissSuggestion = () => {
    setShowSuggestion(false);
  };
  
  // Get AI assistance with writing
  const getWritingAssistance = async (e) => {
    e.preventDefault();
    
    if (!assistanceRequest.trim()) {
      setError('Please specify what kind of assistance you need');
      return;
    }
    
    try {
      setAssistanceLoading(true);
      setError('');
      
      // Extract plain text from HTML content for AI processing
      // Use a more robust method to extract text from HTML
      let textContent = "";
      
      if (content) {
        // First try with DOMParser if in browser environment
        if (typeof DOMParser !== 'undefined') {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            textContent = doc.body.textContent || "";
          } catch (error) {
            console.error('Error parsing HTML with DOMParser:', error);
            // Fallback to regex if DOMParser fails
            textContent = content.replace(/<[^>]+>/g, ' ').trim();
          }
        } else {
          // Fallback to regex if DOMParser is not available
          textContent = content.replace(/<[^>]+>/g, ' ').trim();
        }
      }
      
      // Make sure we have content to send
      if (!textContent || textContent.length < 2) {
        textContent = 'No content provided yet.';
      }
      
      console.log('Sending writing assistance request:', {
        textContentLength: textContent.length,
        requestLength: assistanceRequest.length,
        bookId: selectedBookId || null
      });
      
      const response = await axios.post(`${API_BASE_URL}/api/author-tools/writing-assistance`, {
        currentText: textContent,
        request: assistanceRequest,
        bookId: selectedBookId || null
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      setAssistanceResponse(response.data.assistance);
      setAssistanceLoading(false);
    } catch (err) {
      console.error('Error getting writing assistance:', err);
      setError(err.response?.data?.message || 'Failed to get writing assistance');
      setAssistanceLoading(false);
    }
  };
  
  // Handle adding tags
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  // Handle removing tags
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Load a draft
  const loadDraft = (id) => {
    navigate(`/AuthorHandling/writing/${id}`);
  };
  
  // Create a new draft
  const createNewDraft = () => {
    navigate('/AuthorHandling/writing');
    setTitle('');
    setContent('');
    setNotes('');
    setTags([]);
    setSelectedBookId('');
  };
  
  // Handle keydown events in the editor
  const handleEditorKeyDown = (e) => {
    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = content.substring(0, start) + '    ' + content.substring(end);
      setContent(newValue);
      // Set cursor position after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };
  
  // Export content as text file
  const exportToDocx = () => {
    try {
      // Create a blob from the content
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
<title>${title}</title>
</head>
<body>
${content}
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'draft'}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      setSuccessMessage('Document exported successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error exporting document:', err);
      setError('Failed to export document');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {draftId ? 'Edit Draft' : 'Create New Draft'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAssistancePanel(!showAssistancePanel)}
            className="px-4 py-2 flex items-center rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-300"
          >
            <HelpCircle className="mr-2" size={16} />
            AI Assistance
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition shadow-sm"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={exportToDocx}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition shadow-sm flex items-center gap-2"
            disabled={!content}
          >
            <Download size={18} />
            Export as HTML
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 dark:bg-secondary-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-secondary-600 transition-colors duration-300"
          >
            Back
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 mb-4 rounded">
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-4 sticky top-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Drafts</h3>
            <div className="mb-4">
              <button
                onClick={createNewDraft}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-300"
              >
                <Plus className="mr-2" size={16} />
                New Draft
              </button>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {drafts.length > 0 ? (
                drafts.map(draft => (
                  <div 
                    key={draft._id}
                    onClick={() => loadDraft(draft._id)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center ${draft._id === draftId ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-100 dark:hover:bg-secondary-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <Edit3 className="mr-2" size={14} />
                    <div className="truncate">{draft.title}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No drafts yet</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Editor */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Draft Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your draft"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="book" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Associated Book (Optional)
              </label>
              <select
                id="book"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
              >
                <option value="">Not associated with any book</option>
                {books.map(book => (
                  <option key={book._id} value={book._id}>{book.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4 relative">
              <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Content
              </label>
              {/* Remove custom toolbar buttons and use the built-in Quill toolbar instead */}
              <ReactQuill
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Start writing your book..."
                theme="snow"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-900 text-gray-800 dark:text-gray-200 min-h-[400px]"
              />
              
              {/* AI Text Completion Suggestion */}
              {showSuggestion && textSuggestion && (
                <div className="absolute right-3 bottom-3 z-10 max-w-md bg-white dark:bg-secondary-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Lightbulb className="mr-2" size={16} />
                    AI Suggestion
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 italic text-sm mb-2">{textSuggestion}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={acceptSuggestion}
                      className="px-2 py-1 text-xs bg-primary-500 dark:bg-primary-600 text-white rounded hover:bg-primary-600 dark:hover:bg-primary-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={dismissSuggestion}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
              
              {/* Loading indicator for suggestions */}
              {suggestionsLoading && (
                <div className="absolute right-3 bottom-3 z-10 bg-white dark:bg-secondary-700 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <span className="mr-2 inline-block w-4 h-4 border-2 border-t-primary-500 dark:border-t-primary-400 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></span>
                    Thinking...
                  </p>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Notes (Only visible to you)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes, ideas, or reminders about this draft..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 min-h-[100px] resize-y"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                  >
                    <span className="mr-1">{tag}</span>
                    <button 
                      onClick={() => removeTag(tag)} 
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag"
                  className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white rounded-r-lg hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors duration-300"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
                    {/* AI Writing Assistance Panel - always visible and more prominent */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-6 mt-6 border-2 border-yellow-300 dark:border-yellow-700">
              <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-300 flex items-center">
                <Lightbulb className="mr-2" size={20} />
                AI Writing Assistant
              </h3>
              
              <form onSubmit={getWritingAssistance}>
                <div className="mb-4">
                  <label htmlFor="assistanceRequest" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Ask for writing help:
                  </label>
                  <input
                    type="text"
                    id="assistanceRequest"
                    value={assistanceRequest}
                    onChange={(e) => setAssistanceRequest(e.target.value)}
                    placeholder="E.g., 'Develop this character' or 'Suggest a plot twist' or 'Fix this paragraph'"
                    className="w-full px-4 py-3 rounded-lg border border-yellow-300 dark:border-yellow-700 bg-white dark:bg-secondary-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600"
                    required
                  />
                </div>
                
                <div className="flex gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setAssistanceRequest('Help me develop this character further')}
                    className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                  >
                    Character Development
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssistanceRequest('Suggest a plot twist')}
                    className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                  >
                    Plot Twist
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssistanceRequest('Improve this dialogue')}
                    className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                  >
                    Dialogue Help
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={assistanceLoading || !assistanceRequest.trim()}
                  className={`w-full px-4 py-3 rounded-lg flex items-center justify-center ${assistanceLoading ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700'} text-white transition-colors duration-300 font-medium`}
                >
                  {assistanceLoading ? 'Writing assistant is thinking...' : 'Get AI Writing Help'}
                </button>
              </form>
              
              {assistanceResponse && (
                <div className="mt-4 bg-white dark:bg-secondary-900 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">AI Writing Suggestion:</h4>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {assistanceResponse}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        // Add the AI response to the editor content
                        const newContent = content + "\n\n" + assistanceResponse;
                        setContent(newContent);
                        setSuccessMessage('AI suggestion added to your draft');
                        setTimeout(() => setSuccessMessage(''), 2000);
                      }}
                      className="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors duration-300"
                    >
                      Use This Suggestion
                    </button>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookWritingEditor;
