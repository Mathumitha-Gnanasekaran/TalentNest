import React, { useEffect, useState } from "react";
import PostCompose from "./PostCompose";
import PostItem from "./PostItem";
import { Spinner } from "react-bootstrap";
import { getFollowingPosts } from "../feature/followingPost/followingPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { Utensils } from 'lucide-react';

function NewsFeedContent() {
  const dispatch = useDispatch();
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    dispatch(getFollowingPosts());
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [dispatch]);

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
    }}><div style={{
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
      {/* Header */}
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

      {/* Post Composer */}
      <div style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.1s'
      }}>
        <PostCompose />
      </div>
      
      {/* Following Posts Header */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        marginBottom: '1.5rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.2s'
      }}>
        <h3 style={{
          color: '#ffff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          position: 'relative',
          display: 'inline-block',
          padding: '0 1rem'
        }}>
          Following Posts
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            backgroundColor: '#d97706',
            borderRadius: '2px'
          }}></div>
        </h3>
      </div>
      
      {/* Posts Container */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        //maxWidth: '900px',
        //width:'50vw',
        margin: '0 auto',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 5}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.3s'
      }}>
        {storeFollowingPosts !== null ? (
          storeFollowingPosts.length > 0 ? (
            storeFollowingPosts.map((post, index) => (
              <div 
                key={post.post.id}
                style={{
                  transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                  opacity: animationProgress / 100,
                  transition: 'transform 0.8s, opacity 0.8s',
                  transitionDelay: `${0.3 + index * 0.05}s`
                }}
              >
                <PostItem
                  postId={post.post.id}
                  userId={post.user.id}
                  firstName={post.user.firstName || ""}
                  lastName={post.user.lastName || ""}
                  content={post.post.content}
                  image={post.post.image}
                  images={post.post.images}
                  loveList={post.post.love}
                  shareList={post.post.share}
                  commentList={post.post.comment}
                  postDate={post.post.createdAt}
                  postType={post.post.postType}
                />
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
              <p style={{ color: '#78350f', fontSize: '1.125rem' }}>No posts from people you follow yet. Start following more chefs!</p>
            </div>
          )
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem'
          }}>
            <Spinner animation="border" style={{ color: '#d97706' }} />
          </div>
        )}
      </div>
      
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

export default NewsFeedContent;