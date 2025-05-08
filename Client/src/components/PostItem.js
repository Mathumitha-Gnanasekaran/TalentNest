import React, { useEffect, useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import {
  RiHeartFill,
  RiHeartLine,
  RiMessage2Fill,
  RiShareForwardFill,
  RiSendPlane2Fill
} from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addLove,
  addComment,
} from "../feature/followingPost/followingPostSlice";
import MultiImageUploadView from "../feature/multiImageUploadView";
import axios from "axios";
import { IconButton } from "@mui/material";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { Lightbulb, HelpCircle, Briefcase, Palette, Compass, Zap, MessageCircle } from 'lucide-react';

function PostItem(props) {
  const dispatch = useDispatch();

  const [loveStatus, setLoveStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [sendButtonDisable, setSendButtonDisable] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("psnUserId")
  );
  const [postId, setPostId] = useState(props.postId);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(props.content);
  const [editedImages, setEditedImages] = useState(props.images);
  const [editedPostType, setEditedPostType] = useState(props.postType || "insight");

  const [Cedit, setCedit] = useState(true);
  const [CurrentCommentitem, setCurrentCommentitem] = useState(null);
  const [CeditComment, setCeditComment] = useState("");
  
  // Post type definitions
  const postTypes = {
    insight: {
      id: "insight",
      name: "Insight",
      icon: <Lightbulb size={16} />,
      color: "#6366f1"
    },
    question: {
      id: "question",
      name: "Question",
      icon: <HelpCircle size={16} />,
      color: "#10b981"
    },
    opportunity: {
      id: "opportunity",
      name: "Job/Opportunity",
      icon: <Briefcase size={16} />,
      color: "#f59e0b"
    },
    showcase: {
      id: "showcase",
      name: "Portfolio Showcase",
      icon: <Palette size={16} />,
      color: "#ec4899"
    },
    event: {
      id: "event",
      name: "Event/Meetup",
      icon: <Compass size={16} />,
      color: "#3b82f6"
    },
    resource: {
      id: "resource",
      name: "Learning Resource",
      icon: <Zap size={16} />,
      color: "#8b5cf6"
    },
    discussion: {
      id: "discussion",
      name: "Discussion",
      icon: <MessageCircle size={16} />,
      color: "#64748b"
    }
  };

  // Get post type information based on props or use default
  const getPostType = () => {
    if (props.postType && postTypes[props.postType]) {
      return postTypes[props.postType];
    }
    return postTypes.insight; // Default to insight if not specified
  };

  const currentPostType = getPostType();

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  function handleLoveClick(e) {
    if (!props.loveList.includes(currentUserId)) {
      setLoveStatus(true);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    } else {
      setLoveStatus(false);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    }
  }

  function handleCommentButtonClick(e) {
    setCommentStatus(!commentStatus);
  }

  function handleCommentContentChange(e) {
    e.preventDefault();
    setCommentContent(e.target.value);
    if (commentContent.length - 1 > 0 && commentContent.length - 1 <= 100) {
      setSendButtonDisable(false);
    } else {
      setSendButtonDisable(true);
    }
  }

  function sendComment(e) {
    dispatch(
      addComment({
        postId: postId,
        newComment: {
          userId: localStorage.getItem("psnUserId"),
          userFullname:
            localStorage.getItem("psnUserFirstName") +
            " " +
            localStorage.getItem("psnUserLastName"),
          content: commentContent,
        },
      })
    );
    setCommentContent("");
  }

  const handleEditModalOpen = () => {
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = () => {
    const updatedPostData = {
      id: props.postId,
      content: editedContent,
      images: editedImages,
      postType: editedPostType // Include post type in the update payload
    };

    axios({
      method: "put",
      url: "/api/v1/editpost",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: updatedPostData,
    })
      .then((res) => {
        console.log("Post updated successfully");
        setShowEditModal(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
  };

  const handleCommentEdit = (commentItem) => {
    setCedit(false);
    setCeditComment(commentItem.content);
    setCurrentCommentitem(commentItem);
  };

  const updateComment = () => {
    var data = {
      "commentEntity": {
        "userId": localStorage.getItem("psnUserId"),
        "userFullname": localStorage.getItem("psnUserFirstName") +
          " " +
          localStorage.getItem("psnUserLastName"),
        "content": CeditComment,
        "id": CurrentCommentitem.id ? CurrentCommentitem.id : ""
      },
      "postId": {
        "id": postId
      }
    };
    axios({
      method: "put",
      url: "/api/v1/editcomment",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: data
    }).then((res) => {
      window.location.reload();
    });
  };

  const deleteComment = (commentItem) => {
    setCeditComment(commentItem.content);
    setCurrentCommentitem(commentItem);
    var data = {
      "commentEntity": {
        "userId": localStorage.getItem("psnUserId"),
        "userFullname": localStorage.getItem("psnUserFirstName") +
          " " +
          localStorage.getItem("psnUserLastName"),
        "content": CeditComment,
        "id": commentItem.id ? commentItem.id : ""
      },
      "postId": {
        "id": postId
      }
    };
    axios({
      method: "put",
      url: "/api/v1/deletecomment",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: data
    }).then((res) => {
      window.location.reload();
    });
  };

  const deletePost = () => {
    axios({
      method: "delete",
      url: "/api/v1/deletepost",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: { id: props.postId },
    })
      .then((res) => {
        console.log("Post deleted successfully");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
      });
  };

  const [isSaved, setIsSaved] = useState(false);

  // Add an effect to check if the post is already saved when component mounts
  useEffect(() => {
    checkIfPostIsSaved();
  }, []);

  // Function to check if post is saved
  const checkIfPostIsSaved = () => {
    axios({
      method: "post",
      url: "/api/v1/ispostsaved",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: {
        userId: currentUserId,
        postId: props.postId
      }
    })
    .then((res) => {
      if (res.data.status === "success") {
        setIsSaved(res.data.payload);
      }
    })
    .catch((err) => {
      console.error("Error checking if post is saved:", err);
    });
  };

  // Handle save/unsave post function
  const handlesave = () => {
    const endpoint = isSaved ? "/api/v1/unsavepost" : "/api/v1/savepost";
    
    axios({
      method: "post",
      url: endpoint,
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: {
        userId: currentUserId,
        postId: props.postId
      }
    })
    .then((res) => {
      if (res.data.status === "success") {
        setIsSaved(!isSaved);
        console.log(isSaved ? "Post unsaved successfully" : "Post saved successfully");
      }
    })
    .catch((err) => {
      console.error("Error saving/unsaving post:", err);
    });
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      margin: '20px 0',
      overflow: 'hidden',
      border: `1px solid ${currentPostType.color}20`,
      //maxWidth: '700px',
      width:'55vw',
      position: 'relative'
    }}>
      {/* Post type indicator ribbon */}
      <div style={{
        position: 'absolute',
        top: '0px',
        right: '0',
        backgroundColor: currentPostType.color,
        color: 'white',
        padding: '4px 10px 4px 12px',
        borderRadius: '4px 0 0 4px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: '5'
      }}>
        <span>{currentPostType.icon}</span>
        <span>{currentPostType.name}</span>
      </div>

      <div style={{
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${currentPostType.color}20`,
        background: `linear-gradient(to right, ${currentPostType.color}05, ${currentPostType.color}10)`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${currentPostType.color}`,
          }}>
            <Hashicon value={props.userId} size={44} />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#312e81',
            }}>
              {props.firstName + " " + props.lastName}
            </h4>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
            }}>
              {timeAgo.format(new Date(props.postDate).getTime())}
            </span>
          </div>
        </div>

        {props.userId === currentUserId && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginRight: '70px', // Make space for the type ribbon
          }}>
            <button 
              onClick={handleEditModalOpen}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: currentPostType.color,
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <BsFillPencilFill size={16} />
            </button>
            <button 
              onClick={deletePost}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              <AiFillDelete size={16} />
            </button>
          </div>
        )}
      </div>

      <div style={{
        padding: '20px',
      }}>
        {/* Post type indicator pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: `${currentPostType.color}10`,
          border: `1px solid ${currentPostType.color}20`,
          borderRadius: '16px',
          padding: '4px 10px',
          marginBottom: '12px',
          color: currentPostType.color,
        }}>
          <span style={{ marginRight: '4px' }}>{currentPostType.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>{currentPostType.name}</span>
        </div>

        <p style={{
          fontSize: '16px',
          margin: '0 0 16px 0',
          lineHeight: '1.6',
          color: '#1f2937',
        }}>
          {props.content}
        </p>

        {props.longDesc && (
          <p style={{
            fontSize: '14px',
            margin: '0 0 16px 0',
            color: '#4b5563',
            lineHeight: '1.6',
          }}>
            {props.longDesc}
          </p>
        )}

        {props.images && (
          <div style={{
            marginTop: '16px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${currentPostType.color}15`
          }}>
            <MultiImageUploadView images={props.images} />
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 16px',
        borderTop: `1px solid ${currentPostType.color}20`,
        background: `linear-gradient(to right, ${currentPostType.color}05, ${currentPostType.color}08)`,
      }}>
        <button 
          onClick={handleLoveClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            color: props.loveList.includes(currentUserId) ? '#ef4444' : '#6b7280',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {props.loveList.includes(currentUserId) ? (
            <RiHeartFill size={20} color="rgb(250, 120, 22)" />
          ) : (
            <RiHeartLine size={20} />
          )}
          {props.loveList.length > 0 && (
            <span style={{color:"rgb(250, 120, 22)"}}>{props.loveList.length}</span>
          )}
        </button>

        <button 
          onClick={handleCommentButtonClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            color: commentStatus ? currentPostType.color : '#6b7280',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <RiMessage2Fill size={20} />
          {props.commentList.length > 0 && (
            <span>{props.commentList.length}</span>
          )}
        </button>

        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            color: isSaved ? 'rgb(250, 120, 22)' : '#6b7280',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
          }}
          onClick={handlesave}
        >
          {isSaved ? (
            <RiBookmarkFill size={20} color='rgb(250, 120, 22)' />
          ) : (
            <RiBookmarkLine size={20} />
          )}
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      {!Cedit && (
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${currentPostType.color}20`,
        }}>
          <Form.Control
            as="textarea"
            value={CeditComment}
            onChange={(e) => setCeditComment(e.target.value)}
            style={{
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              resize: 'none',
              marginBottom: '12px',
            }}
          />
        </div>
      )}

      {!Cedit && (
        <div style={{
          padding: '0 16px 16px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
        }}>
          <Button 
            onClick={() => setCedit(true)}
            style={{
              background: '#f3f4f6',
              border: 'none',
              color: '#4b5563',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Cancel
          </Button>

          <Button 
            onClick={updateComment}
            style={{
              background: `linear-gradient(to right, ${currentPostType.color}, ${currentPostType.color}cc)`,
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Update
          </Button>
        </div>
      )}

      {commentStatus && (
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${currentPostType.color}20`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}>
            <Form.Control
              as="textarea"
              placeholder="Add a comment..."
              value={commentContent}
              onChange={handleCommentContentChange}
              style={{
                borderRadius: '8px',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                resize: 'none',
                flex: 1,
              }}
            />
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                fontSize: '12px',
                color: commentContent.length >= 100 ? '#ef4444' : '#6b7280',
              }}>
                {commentContent.length}/100
              </span>
              
              <button 
                onClick={sendComment}
                disabled={sendButtonDisable}
                style={{
                  background: sendButtonDisable ? '#d1d5db' : `linear-gradient(to right, ${currentPostType.color}, ${currentPostType.color}cc)`,
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: sendButtonDisable ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <RiSendPlane2Fill size={18} />
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '4px',
          }}>
            {props.commentList.map((commentItem, index) => (
              <div 
                key={index}
                style={{
                  padding: '12px',
                  background: 'rgba(243, 244, 246, 0.5)',
                  borderRadius: '8px',
                  position: 'relative',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `1px solid ${currentPostType.color}`,
                  }}>
                    <Hashicon value={commentItem.userId} size={34} /> 
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4b5563',
                  }}>
                    {commentItem.userFullname}
                  </div>
                </div>
                
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#1f2937',
                  lineHeight: '1.5',
                  paddingLeft: '44px',
                }}>
                  {commentItem.content}
                </p>

                {Cedit && commentItem.userId === currentUserId && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '8px',
                  }}>
                    <button 
                      onClick={() => handleCommentEdit(commentItem)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: currentPostType.color,
                        padding: '2px',
                        fontSize: '12px',
                      }}
                    >
                      edit
                    </button>
                    
                    <button 
                      onClick={() => deleteComment(commentItem)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '2px',
                        fontSize: '12px',
                      }}
                    >
                      delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal show={showEditModal} onHide={handleEditModalClose} centered>
        <Modal.Header style={{
          background: `linear-gradient(to right, ${currentPostType.color}08, ${currentPostType.color}15)`,
          borderBottom: `1px solid ${currentPostType.color}30`,
        }}>
          <Modal.Title style={{
            color: '#312e81',
            fontSize: '18px',
            fontWeight: '600',
          }}>
            Edit Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          padding: '20px',
        }}>
          <Form>
            {/* Post Type Selection in Edit Modal */}
            <Form.Group className="mb-3">
              <Form.Label style={{
                color: '#4b5563',
                fontWeight: '500',
              }}>
                Post Type
              </Form.Label>
              <Form.Select 
                value={editedPostType}
                onChange={(e) => setEditedPostType(e.target.value)}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '10px',
                  fontSize: '14px',
                }}
              >
                {Object.keys(postTypes).map((type) => (
                  <option key={type} value={type}>
                    {postTypes[type].name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{
                color: '#4b5563',
                fontWeight: '500',
              }}>
                Content
              </Form.Label>
              <Form.Control
                as="textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '10px',
                  fontSize: '14px',
                  minHeight: '100px',
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{
                color: '#4b5563',
                fontWeight: '500',
              }}>
                Images (Comma-separated URLs)
              </Form.Label>
              <Form.Control
                type="text"
                value={editedImages ? editedImages.join(", ") : ""}
                onChange={(e) => {
                  setEditedImages(e.target.value.split(",").map((url) => url.trim()))
                }}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '10px',
                  fontSize: '14px',
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{
          borderTop: `1px solid ${currentPostType.color}30`,
          padding: '12px 20px',
        }}>
          <Button 
            onClick={handleEditModalClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              color: '#4b5563',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            style={{
              background: `linear-gradient(to right, ${currentPostType.color}, ${currentPostType.color}cc)`,
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostItem;