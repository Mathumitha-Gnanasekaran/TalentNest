import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from "../feature/followingPost/followingPostSlice";
import MultiImageUpload from "../feature/multiImageUpload";
import { Share2, Image, Send, ChevronDown, Lightbulb, HelpCircle, Briefcase, Palette, Compass, Zap, MessageCircle } from 'lucide-react';

function PostCompose() {
  const dispatch = useDispatch();
  const userIds = localStorage.getItem("psnUserId")
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);

  const [userFullname, setUserFullname] = useState(
    localStorage.getItem("psnUserFirstName") +
    " " +
    localStorage.getItem("psnUserLastName")
  );
  const [userId, setUserId] = useState(localStorage.getItem("psnUserId"));
  const [postContent, setPostContent] = useState("");
  const [postContentCount, setPostContentCount] = useState(0);
  const [disablePostButton, setDisablePostButton] = useState(true);
  const [file, setFile] = useState(null);
  const [MultiImages, setMultiImages] = useState(null);
  const [MultiImagesUrl, setMultiImagesUrl] = useState(null);
  const [file64String, setFile64String] = useState(null);
  const [file64StringWithType, setFile64StringWithType] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  // New state for post type dropdown
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState({
    id: "insight",
    name: "Share Insight",
    icon: <Lightbulb size={18} />,
    color: "#6366f1"
  });
  
  // Post type options
  const postTypes = [
    {
      id: "insight",
      name: "Share Insight",
      icon: <Lightbulb size={18} />,
      color: "#6366f1",
      placeholder: "Share your knowledge or insights..."
    },
    {
      id: "question",
      name: "Ask Question",
      icon: <HelpCircle size={18} />,
      color: "#10b981",
      placeholder: "What would you like to know?"
    },
    {
      id: "opportunity",
      name: "Job/Opportunity",
      icon: <Briefcase size={18} />,
      color: "#f59e0b",
      placeholder: "Share a job opening or opportunity..."
    },
    {
      id: "showcase",
      name: "Portfolio Showcase",
      icon: <Palette size={18} />,
      color: "#ec4899",
      placeholder: "Show off your latest work or project..."
    },
    {
      id: "event",
      name: "Event/Meetup",
      icon: <Compass size={18} />,
      color: "#3b82f6",
      placeholder: "Share an event or gathering..."
    },
    {
      id: "resource",
      name: "Learning Resource",
      icon: <Zap size={18} />,
      color: "#8b5cf6",
      placeholder: "Share a helpful resource or tutorial..."
    },
    {
      id: "discussion",
      name: "Start Discussion",
      icon: <MessageCircle size={18} />,
      color: "#64748b",
      placeholder: "What's on your mind to discuss?"
    }
  ];
  
  var marray = [];

  function showSuccessMessage(inputMessage) {
    toast.success(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function showFailMessage(inputMessage) {
    toast.error(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function handleContentChange(e) {
    setPostContent(e.target.value);
    setPostContentCount(e.target.value.length);
    if (postContentCount === 0 || postContentCount > 200) {
      setDisablePostButton(true);
    } else {
      setDisablePostButton(false);
    }
  }

  async function createPost(inputContent) {
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/insertpost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: {
          id: null,
          userId: localStorage.getItem("psnUserId"),
          content: inputContent,
          image: file64StringWithType, // Single image (from the original upload method)
          createdAt: null,
          love: null,
          share: null,
          comment: null,
          images: MultiImagesUrl, // Multiple media files (images and videos)
          // Added post type to the payload
          postType: selectedPostType.id
        },
      });
  
      if (response.data !== null && response.data.status === "success") {
        showSuccessMessage("Posted successfully!");
        setPostContent("");
        setPostContentCount(0);
        setDisablePostButton(true);
        setFile64String(null);
        setFile64StringWithType(null);
        setMultiImages(null);
        setMultiImagesUrl(null);
      }
  
      if (response.data !== null && response.data.status === "fail") {
        showFailMessage("Post failed. Please try again later!");
      }
    } catch (error) {
      showFailMessage("Post failed. Please try again later!");
    }
  }

  function onUploadFileChange(e) {
    setFile64String(null);
    if (e.target.files < 1 || !e.target.validity.valid) {
      return;
    }
    console.log(e, "e");

    compressImageFile(e);
  }

  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  }

  async function compressImageFile(event) {
    const imageFile = event.target.files[0];

    const options = {
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      // input file is compressed in compressedFile, now write further logic here

      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          setFile(result);
          setFile64StringWithType(result);
          setFile64String(String(result.split(",")[1]));
        }
      });
    } catch (error) {
      setFile64String(null);
    }
  }

  async function compressImageFileTest(images) {
    const imageFile = images;

    const options = {
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);

      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          console.log(String(result.split(",")[1]), "log");
          let url = `${result}`
          marray.push(url)
          console.log(marray,"marray");
          setMultiImagesUrl(marray)
          return result
        }
      });
    } catch (error) {
      setFile64String(null);
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    createPost(postContent);
    dispatch(getFollowingPosts());
    window.location.reload();
  }

  async function multiHandle(mediaItems) {
    if (mediaItems && mediaItems.length > 0) {
      // Extract just the base64 strings from the processed media objects
      const base64Strings = mediaItems.map(item => item.base64);
      setMultiImagesUrl(base64Strings);
    }
  }

  // Handle post type selection
  function selectPostType(type) {
    setSelectedPostType(type);
    setIsTypeDropdownOpen(false);
  }

  // Find placeholder text based on selected post type
  const getPlaceholder = () => {
    const type = postTypes.find(type => type.id === selectedPostType.id);
    return type ? type.placeholder : "Share your skills or ask a question...";
  };

  return (
    <div style={{
     // maxWidth: '800px',
      margin: '0 auto',
      width:'75vw',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${selectedPostType.color}20, ${selectedPostType.color}10)`,
          zIndex: 0,
          transition: 'background 0.3s ease'
        }} />
        
        <ToastContainer />

        <Form style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                marginRight: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedPostType.color,
                borderRadius: '50%',
                padding: '0.25rem',
                width: '3.5rem',
                height: '3.5rem',
                transition: 'background-color 0.3s ease'
              }}>
                {userId ? (
                  <Hashicon value={userId} size={48} />
                ) : (
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '0.5rem'
                  }}>
                    <Share2 size={24} style={{ color: selectedPostType.color }} />
                  </div>
                )}
              </div>
              <div style={{
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: '#1f2937'
              }}>
                {userFullname || 'SKILLINK User'}
              </div>
            </div>

            {/* Post Type Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: `${selectedPostType.color}10`,
                  border: `1px solid ${selectedPostType.color}30`,
                  borderRadius: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: selectedPostType.color,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{selectedPostType.icon}</span>
                <span>{selectedPostType.name}</span>
                <ChevronDown size={16} style={{ marginLeft: '0.5rem', transition: 'transform 0.2s ease', transform: isTypeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              
              {isTypeDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  zIndex: 10,
                  background: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  width: '220px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  {postTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => selectPostType(type)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: selectedPostType.id === type.id ? `${type.color}15` : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.2s ease',
                        color: type.color
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = `${type.color}10`;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = selectedPostType.id === type.id ? `${type.color}15` : 'transparent';
                      }}
                    >
                      <span style={{ marginRight: '0.75rem' }}>{type.icon}</span>
                      <span style={{ color: '#374151' }}>{type.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post Type Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
            background: `${selectedPostType.color}08`,
            border: `1px solid ${selectedPostType.color}20`,
          }}>
            <span style={{ color: selectedPostType.color, marginRight: '0.5rem' }}>
              {selectedPostType.icon}
            </span>
            <span style={{ color: selectedPostType.color, fontSize: '0.875rem', fontWeight: '500' }}>
              {selectedPostType.name}
            </span>
          </div>

          <Form.Group style={{ marginBottom: '1rem' }}>
            <Form.Control
              as="textarea"
              placeholder={getPlaceholder()}
              value={postContent}
              onChange={handleContentChange}
              style={{
                resize: 'none',
                height: '7rem',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: `1px solid ${selectedPostType.color}30`,
                fontSize: '1rem',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                background: `${selectedPostType.color}05`
              }}
            />
          </Form.Group>

          <div style={{
            backgroundColor: `${selectedPostType.color}08`,
            borderRadius: '0.75rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            border: `1px solid ${selectedPostType.color}15`
          }}>
            <MultiImageUpload multiHandle={multiHandle} />
          </div>

          {file64StringWithType && (
            <div style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              maxHeight: '300px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img 
                src={file64StringWithType} 
                alt="preview" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: postContentCount > 180 ? (postContentCount > 200 ? '#ef4444' : '#f59e0b') : '#6b7280'
            }}>
              {postContentCount}/200 characters
            </span>
            
            <Button
              onClick={handleCreatePost}
              disabled={disablePostButton}
              style={{
                background: disablePostButton ? '#d1d5db' : `linear-gradient(to right, ${selectedPostType.color}, ${selectedPostType.color}cc)`,
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'white',
                cursor: disablePostButton ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                transform: isHovered && !disablePostButton ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered && !disablePostButton ? `0 4px 12px ${selectedPostType.color}40` : 'none'
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span>Post {selectedPostType.name}</span>
              <Send size={16} />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default PostCompose;