import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
import MultiPDFViewer from './MultiPDFViewer';
import './EducationalContent.css';

const EducationalContentFeed = ({ userId }) => {
  const [contentFeed, setContentFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('following');
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDFContent, setSelectedPDFContent] = useState(null);
  
  // States for updating content
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [contentToUpdate, setContentToUpdate] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedTags, setUpdatedTags] = useState('');
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  const token = localStorage.getItem("psnToken");

  const fetchContent = async (endpoint) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `/api/v1/educational/${endpoint}`,
        { id: userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      if (response.data.status === 'success') {
        setContentFeed(response.data.payload);
      } else {
        setError(response.data.message);
        setContentFeed([]);
      }
    } catch (error) {
      setError('Failed to fetch content');
      setContentFeed([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab, userId]);

  const handleMarkAsLearned = async (contentId) => {
    try {
      const response = await axios.post(
        '/api/v1/educational/mark-learned',
        { contentId, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === 'success') {
        setContentFeed(prevFeed => {
          const updatedFeed = [...prevFeed];
          if (Array.isArray(updatedFeed)) {
            if (activeTab === 'following') {
              return updatedFeed.map(item => {
                if (item.content.id === contentId) {
                  const updatedContent = { ...item.content };
                  updatedContent.learnedBy = updatedContent.learnedBy.includes(userId)
                    ? updatedContent.learnedBy.filter(id => id !== userId)
                    : [...updatedContent.learnedBy, userId];
                  return { ...item, content: updatedContent };
                }
                return item;
              });
            } else {
              return updatedFeed.map(content => {
                if (content.id === contentId) {
                  content.learnedBy = content.learnedBy.includes(userId)
                    ? content.learnedBy.filter(id => id !== userId)
                    : [...content.learnedBy, userId];
                }
                return content;
              });
            }
          }
          return updatedFeed;
        });
      }
    } catch (error) {
      console.error("Error marking content as learned:", error);
    }
  };

  const handleBookmark = async (contentId) => {
    try {
      const response = await axios.post(
        '/api/v1/educational/bookmark',
        { contentId, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === 'success') {
        setContentFeed(prevFeed => {
          const updatedFeed = [...prevFeed];
          if (Array.isArray(updatedFeed)) {
            if (activeTab === 'following') {
              return updatedFeed.map(item => {
                if (item.content.id === contentId) {
                  const updatedContent = { ...item.content };
                  updatedContent.bookmarkedBy = updatedContent.bookmarkedBy.includes(userId)
                    ? updatedContent.bookmarkedBy.filter(id => id !== userId)
                    : [...updatedContent.bookmarkedBy, userId];
                  return { ...item, content: updatedContent };
                }
                return item;
              });
            } else {
              return updatedFeed.map(content => {
                if (content.id === contentId) {
                  content.bookmarkedBy = content.bookmarkedBy.includes(userId)
                    ? content.bookmarkedBy.filter(id => id !== userId)
                    : [...content.bookmarkedBy, userId];
                }
                return content;
              });
            }
          }
          return updatedFeed;
        });
      }
    } catch (error) {
      console.error("Error bookmarking content:", error);
    }
  };

  const handleViewPDF = (content) => {
    setSelectedPDFContent(content);
    setShowPDFViewer(true);
  };
  
  // Handle opening update modal
  const handleUpdateClick = (content) => {
    setContentToUpdate(content);
    setUpdatedTitle(content.title);
    setUpdatedDescription(content.description);
    setUpdatedContent(content.content || '');
    setUpdatedTags(content.tags ? content.tags.join(', ') : '');
    setShowUpdateModal(true);
  };
  
  // Handle update submission
  const handleUpdateSubmit = async () => {
    try {
      // Convert tags string back to array
      const tagsArray = updatedTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const updatedContentData = {
        id: contentToUpdate.id,
        userId: userId,
        title: updatedTitle,
        description: updatedDescription,
        content: updatedContent,
        contentType: contentToUpdate.contentType,
        fileUrl: contentToUpdate.fileUrl,
        tags: tagsArray
      };
      
      const response = await axios.put(
        '/api/v1/educational/update',
        updatedContentData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Update the content in the feed
        setContentFeed(prevFeed => 
          prevFeed.map(content => 
            content.id === contentToUpdate.id ? response.data.payload : content
          )
        );
        
        // Close the modal
        setShowUpdateModal(false);
      } else {
        alert(`Update failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating content:", error);
      alert(`Error updating content: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Handle delete click
  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setShowDeleteConfirm(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.post(
        '/api/v1/educational/delete',
        { contentId: contentToDelete.id, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Remove the deleted content from the feed
        setContentFeed(prevFeed => 
          prevFeed.filter(content => content.id !== contentToDelete.id)
        );
        
        // Close the confirmation modal
        setShowDeleteConfirm(false);
      } else {
        alert(`Delete failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      alert(`Error deleting content: ${error.response?.data?.message || error.message}`);
    }
  };

  const renderContent = (item) => {
    const content = activeTab === 'following' ? item.content : item;
    const user = activeTab === 'following' ? item.user : null;
    
    const isLearned = content.learnedBy?.includes(userId);
    const isBookmarked = content.bookmarkedBy?.includes(userId);
    const isOwner = content.userId === userId;

    return (
      <div key={content.id} className="content-card">
        {user && (
          <div className="content-author">
            <span className="author-name">{user.fullname || user.username}</span>
          </div>
        )}

        <h3 className="content-title">{content.title}</h3>
        <p className="content-description">{content.description}</p>

        {content.tags?.length > 0 && (
          <div className="content-tags">
            {content.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="content-info">
          <span className="content-type">
            {content.contentType === 'PDF' ? '📄 PDF' : '📝 Text'}
          </span>
          <span className="content-date">
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="content-actions">
          <button 
            className={`action-btn ${isLearned ? 'active' : ''}`}
            onClick={() => handleMarkAsLearned(content.id)}
          >
            {isLearned ? '✓ Learned' : 'Mark as Learned'}
          </button>

          <button 
            className={`action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => handleBookmark(content.id)}
          >
            {isBookmarked ? '★ Bookmarked' : 'Bookmark'}
          </button>

          {content.contentType === 'PDF' && content.content && (
            <button 
              className="action-btn view-btn"
              onClick={() => handleViewPDF(content)}
            >
              View PDF
            </button>
          )}

          {content.contentType === 'TEXT' && (
            <button 
              className="action-btn view-btn"
              onClick={() => alert(content.content)}
            >
              View Content
            </button>
          )}
          
          {/* Show Edit and Delete buttons only if user owns the content */}
          {isOwner && activeTab === 'user' && (
            <>
              <button 
                className="action-btn edit-btn"
                onClick={() => handleUpdateClick(content)}
              >
                Edit
              </button>
              
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDeleteClick(content)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="edu-content-container">
      <div className="content-tabs">
        <button 
          className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
        <button 
          className={`tab-btn ${activeTab === 'learned' ? 'active' : ''}`}
          onClick={() => setActiveTab('learned')}
        >
          Learned
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookmarked' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarked')}
        >
          Bookmarked
        </button>
        <button 
          className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          My Content
        </button>
      </div>

      <div className="content-feed">
        {loading ? (
          <div className="loading">Loading content...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : contentFeed.length === 0 ? (
          <div className="no-content">No content found</div>
        ) : (
          <div className="content-list">
            {contentFeed.map(item => renderContent(item))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <Modal show={showPDFViewer} onHide={() => setShowPDFViewer(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPDFContent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPDFContent && <MultiPDFViewer pdfs={[selectedPDFContent.content]} />}
        </Modal.Body>
      </Modal>
      
      {/* Update Content Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Educational Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedTitle} 
                onChange={(e) => setUpdatedTitle(e.target.value)} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={updatedDescription} 
                onChange={(e) => setUpdatedDescription(e.target.value)} 
              />
            </Form.Group>
            
            {contentToUpdate?.contentType === 'TEXT' && (
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={5} 
                  value={updatedContent} 
                  onChange={(e) => setUpdatedContent(e.target.value)} 
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedTags} 
                onChange={(e) => setUpdatedTags(e.target.value)} 
                placeholder="tag1, tag2, tag3" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EducationalContentFeed;