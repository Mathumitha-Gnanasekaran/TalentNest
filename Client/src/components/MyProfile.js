import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfilePosts } from "../feature/checkProfile/checkProfileSlice";
import { getProfileInfo } from "../feature/checkProfile/checkProfileSlice";
import PostItem from "./PostItem";
import SavedPosts from "./SavedPosts";
import { Button, Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Utensils, BookOpen, Pencil, Trash2, UserX } from 'lucide-react';

function MyProfile(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.checkProfileReducer.postList);
  const userInfo = useSelector((state) => state.checkProfileReducer.profileInfo);

  // Animation state
  const [animationProgress, setAnimationProgress] = useState(0);

  // States for profile management
  const [editPostId, setEditPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [BioContent, setBioContent] = useState(localStorage.getItem("psnBio") ? localStorage.getItem("psnBio") : "");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Toast message functions
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

  // Form validation schema
  const schema = yup.object().shape({
    bio: yup.string().required("Bio is required"),
  });

  // Handle bio form submission
  async function handleSubmit(values) {
    setSubmitting(true);

    const { bio } = values;

    let obj = {
      "firstName": localStorage.getItem("psnUserFirstName"),
      "lastName": localStorage.getItem("psnUserLastName"),
      "email": localStorage.getItem("psnUserEmail"),
      "password": "123456",
      "role": "user",
      "id": localStorage.getItem("psnUserId"),
      "nic": localStorage.getItem("nic"),
      "bio": bio
    }
    try {
      const response = await axios({
        method: "put",
        url: "/api/v1/users/update",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });
      localStorage.setItem("psnBio", response.data.payload.bio);
      showSuccessMessage("Profile updated successfully!");
    } catch (error) {
      showFailMessage("Update failed. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  // Load profile data on component mount
  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }

    if (localStorage.getItem("psnUserId") !== null) {
      dispatch(getProfilePosts(localStorage.getItem("psnUserId")));
      dispatch(getProfileInfo(localStorage.getItem("psnUserId")));
    }
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Post editing functions
  const handleEditPost = (postItem) => {
    setEditPostId(postItem.id);
    setEditedPostContent(postList.find(post => post.id === postItem.id).content);
  };
  
  async function createPost(obj) {
    try {
      const response = await axios({
        method: "put",
        url: "/api/v1/editpost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });

      if (response.data !== null && response.data.status === "success") {
        showSuccessMessage("Post updated successfully!");
        window.location.reload();
      }

      if (response.data !== null && response.data.status === "fail") {
        showFailMessage("Update failed. Please try again.");
      }
    } catch (error) {
      showFailMessage("Update failed. Please try again.");
    }
  }
  
  const handleSavePost = (postItem) => {
    let obj = Object.assign({}, postItem);
    if (obj['content']) {
      obj.content = editedPostContent;
    }
    createPost(obj);
  };
  
  async function deletePost(obj) {
    try {
      const response = await axios({
        method: "delete",
        url: "/api/v1/deletepost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      });

      if (response.data !== null && response.data.status === "success") {
        showSuccessMessage("Post deleted successfully!");
        window.location.reload();
      }

      if (response.data !== null && response.data.status === "fail") {
        showFailMessage("Delete failed. Please try again.");
      }
    } catch (error) {
      showFailMessage("Delete failed. Please try again.");
    }
  }
  
  // Post deletion handler
  const handleDeletePost = (postId) => {
    let idobj = {
      "id": postId.id
    }
    deletePost(idobj);
  };

  // Account deletion handler
  const HandleDeleteUser = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      let obj = {
        id: localStorage.getItem("psnUserId"),
      }
      axios({
        method: "delete",
        url: "/api/v1/users/delete",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: obj
      }).then((res) => {
        showSuccessMessage("Account deleted successfully!");
        localStorage.clear();
        window.location.href = '/signin';
      }).catch((err) => {
        showFailMessage("Delete failed. Please try again later!");
      });
    }
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #7c2d12, #b45309)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden'
    }}>
      {/* Circular elements */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={i}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: 0.1,
            width: `${Math.random() * 150 + 50}px`,
            height: `${Math.random() * 150 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `scale(${animationProgress / 100})`,
            transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: `${i * 0.05}s`
          }}
        />
      ))}
      
      {/* Background shapes */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={`shape-${i}`}
          style={{
            position: 'absolute',
            borderRadius: '20%',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            width: `${Math.random() * 100 + 150}px`,
            height: `${Math.random() * 100 + 150}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg) scale(${animationProgress / 100})`,
            transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: `${i * 0.1 + 0.2}s`
          }}
        />
      ))}
    </div>
      <ToastContainer />
      
      {/* Header with brand */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
      }}>
        <div style={{
          backgroundColor: '#ffff',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          marginRight: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Utensils size={32} style={{ color: '#b45309' }} />
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#ffff',
          margin: 0
        }}>COOKSHARE</h1>
      </div>
      
      {/* Profile Card */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '800px',
        width: '90%',
        margin: '0 auto',
        padding: '2rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.1s'
      }}>
        {/* Profile Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #92400e, #ea580c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {userInfo && userInfo.firstName && userInfo.firstName.charAt(0)}
              {userInfo && userInfo.lastName && userInfo.lastName.charAt(0)}
            </div>
          </div>
          
          <h1 style={{ 
            fontWeight: 'bold',
            color: '#78350f',
            marginBottom: '0.5rem'
          }}>
            {userInfo && userInfo.firstName} {userInfo && userInfo.lastName}
          </h1>
          
          <div style={{
            width: '60px',
            height: '3px',
            backgroundColor: '#d97706',
            borderRadius: '2px',
            margin: '0 auto'
          }}></div>
        </div>
        
        {/* Bio Section */}
        <div style={{
          marginBottom: '2rem',
          padding: '0 1rem'
        }}>
          <Formik
            validationSchema={schema}
            initialValues={{ bio: BioContent }}
            onSubmit={handleSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBio">
                  <Form.Label style={{ 
                    color: '#92400e',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Pencil size={18} /> About Me
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.bio && !!errors.bio}
                    style={{
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      borderColor: '#e5e7eb',
                      marginBottom: '1rem'
                    }}
                    as="textarea"
                    rows={3}
                    placeholder="Tell others about yourself and your culinary interests..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bio}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    backgroundColor: '#d97706',
                    borderColor: '#d97706',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1.5rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        
        {/* Profile Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          {/* My Posts Button */}
          <Button
            onClick={handleShowModal}
            style={{
              backgroundColor: '#92400e',
              borderColor: '#92400e',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '300px',
              justifyContent: 'center'
            }}
          >
            <BookOpen size={18} />
            My Recipes & Posts
          </Button>
          
          {/* SavedPosts Component */}
          <SavedPosts />
          
          {/* Delete Account Button */}
          <Button
            onClick={HandleDeleteUser}
            style={{
              backgroundColor: '#ef4444',
              borderColor: '#ef4444',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '300px',
              justifyContent: 'center',
              marginTop: '1rem'
            }}
          >
            <UserX size={18} />
            Delete My Account
          </Button>
        </div>
      </div>
      
      {/* Posts Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        centered 
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Modal.Header closeButton style={{ 
          backgroundColor: "#92400e",
          color: "white",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem"
        }}>
          <Modal.Title style={{ 
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <BookOpen size={20} /> My Recipes & Posts
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ 
          maxHeight: "500px", 
          overflowY: "auto",
          padding: "1.5rem" 
        }}>
          {postList !== null && postList.length > 0 ? (
            postList.map((postItem) => (
              <div key={postItem.id} style={{ marginBottom: "20px" }}>
                {editPostId === postItem.id ? (
                  <div style={{
                    background: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb"
                  }}>
                    <Form.Control
                      type="text"
                      name="bio"
                      value={editedPostContent}
                      onChange={(e) => {
                        setEditedPostContent(e.target.value);
                      }}
                      as="textarea"
                      rows={3}
                      style={{ 
                        marginBottom: "1rem",
                        borderRadius: "0.5rem"
                      }}
                    />
                    <div style={{
                      display: "flex",
                      gap: "0.5rem"
                    }}>
                      <Button
                        onClick={() => {
                          handleSavePost(postItem);
                        }}
                        style={{ 
                          backgroundColor: '#d97706',
                          borderColor: '#d97706',
                        }}
                      >
                        UPDATE
                      </Button>
                      <Button
                        onClick={() => {
                          setEditPostId(null);
                        }}
                        variant="outline-secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <PostItem
                    postId={postItem.id}
                    userId={postItem.userId}
                    firstName={
                      userInfo && userInfo.firstName ? userInfo.firstName : ""
                    }
                    lastName={
                      userInfo && userInfo.lastName ? userInfo.lastName : ""
                    }
                    content={postItem.content}
                    image={postItem.image}
                    loveList={postItem.love}
                    shareList={postItem.share}
                    commentList={postItem.comment}
                    postDate={postItem.createdAt}
                    editClick={() => handleEditPost(postItem)}
                    deleteClick={() => handleDeletePost(postItem)}
                    images={postItem.images}
                  />
                )}
              </div>
            ))
          ) : (
            <div style={{
              textAlign: "center",
              padding: "2rem",
              color: "#78350f"
            }}>
              <p>You haven't shared any recipes yet. Start cooking and sharing!</p>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer style={{ 
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #e5e7eb",
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem"
        }}>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            style={{
              borderRadius: "0.5rem"
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Decorative elements */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '150px',
        background: 'linear-gradient(to top, rgba(180, 83, 9, 0.1), transparent)',
        zIndex: '-1'
      }}></div>
      
      {/* Floating decorative elements similar to the signin page */}
      <div style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: '-1'
        }}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                backgroundColor: '#f97316',
                opacity: 0.05,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${animationProgress / 100})`,
                transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: `${i * 0.05}s`
              }}
            />
          ))}
      </div>
    </div>
  );
}

export default MyProfile;