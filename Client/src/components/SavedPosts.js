import React, { useEffect, useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import axios from "axios";
import PostItem from "./PostItem";
import { ToastContainer, toast } from "react-toastify";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";


function SavedPosts() {
  const [showModal, setShowModal] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
    fetchSavedPosts();
  };

  const handleCloseModal = () => setShowModal(false);

  const showSuccessMessage = (inputMessage) => {
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
  };

  const showFailMessage = (inputMessage) => {
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
  };

  const fetchSavedPosts = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/savedposts",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: {
          id: localStorage.getItem("psnUserId"),
        },
      });

      if (response.data && response.data.status === "success") {
        setSavedPosts(response.data.payload || []);
      } else {
        showFailMessage("Failed to fetch saved posts");
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      showFailMessage("Error fetching saved posts");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsavePost = async (postId) => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/unsavepost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: {
          userId: localStorage.getItem("psnUserId"),
          postId: postId,
        },
      });

      if (response.data && response.data.status === "success") {
        showSuccessMessage("Post removed from saved posts");
        // Remove the post from the local state
        setSavedPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        showFailMessage("Failed to remove post from saved posts");
      }
    } catch (error) {
      console.error("Error unsaving post:", error);
      showFailMessage("Error removing post from saved posts");
    }
  };

  return (
    <>
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
        <RiBookmarkFill size={18} />
        Bookmarked Recipes
      </Button>

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
             My Recipes & Posts
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center">Loading saved posts...</div>
          ) : savedPosts.length > 0 ? (
            savedPosts.map((postItem) => (
              <div key={postItem.id} style={{ marginBottom: "20px" }}>
                <PostItem
                  postId={postItem.id}
                  userId={postItem.userId}
                  firstName={postItem.userFirstName || ""}
                  lastName={postItem.userLastName || ""}
                  content={postItem.content}
                  image={postItem.image}
                  loveList={postItem.love}
                  shareList={postItem.share}
                  commentList={postItem.comment}
                  postDate={postItem.createdAt}
                  images={postItem.images}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleUnsavePost(postItem.id)}
                  style={{ marginTop: "10px" }}
                >
                  Remove from Saved
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center">No saved posts available</div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#f8f9fa" }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SavedPosts;