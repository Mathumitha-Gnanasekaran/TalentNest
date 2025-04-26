import React, { useState } from 'react';
import axios from 'axios';
import MultiPDFUpload from './MultiPDFUpload';
import './EducationalContent.css';

const EducationalContentShare = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('TEXT');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [pdfFiles, setPdfFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePDFUpload = (processedPDFs) => {
    setPdfFiles(processedPDFs);
    // Set the first PDF's base64 as content (you can modify this logic as needed)
    if (processedPDFs.length > 0) {
      setContent(processedPDFs[0].base64);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // The form's default submit will be prevented, and we'll use the onClick handler instead
  };

  const handleButtonClick = async () => {
    if (uploading) return; // Prevent multiple clicks while uploading
    
    setUploading(true);
    setMessage('');
    setError('');
  
    try {
      const token = localStorage.getItem("psnToken");
      
      // Create educational content with PDF base64 as content
      const contentData = {
        userId,
        title,
        description,
        contentType,
        content: contentType === 'TEXT' ? content : pdfFiles[0]?.base64 || '',
        fileUrl: '', // No need for fileUrl since we're storing base64 in content
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };
      
      console.log("Creating content with data:", contentData);
      
      const response = await axios.post('/api/v1/educational/create', contentData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
  
      console.log("Content creation response:", response.data);
      
      if (response.data.status === 'success') {
        setMessage('Content shared successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setContentType('TEXT');
        setContent('');
        setTags('');
        setPdfFiles([]);
      } else {
        setError(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Operation error:', error);
      setError(`Error: ${error.message || 'An unknown error occurred'}`);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="edu-content-container">
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      <form onSubmit={handleFormSubmit} className="edu-content-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contentType">Content Type:</label>
          <select 
            id="contentType" 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="TEXT">Text</option>
            <option value="PDF">PDF</option>
          </select>
        </div>
        
        {contentType === 'TEXT' ? (
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea 
              id="content" 
              className="content-textarea"
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
            />
          </div>
        ) : (
          <div className="form-group">
            <label>PDF Files:</label>
            <MultiPDFUpload multiHandle={handlePDFUpload} />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated):</label>
          <input 
            type="text" 
            id="tags" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="e.g. science, biology, notes" 
          />
        </div>
        
        <button 
          type="button" 
          className="submit-btn" 
          onClick={handleButtonClick} 
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Share Content'}
        </button>
      </form>
    </div>
  );
};

export default EducationalContentShare;