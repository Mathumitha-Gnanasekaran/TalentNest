import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAccounts } from "../feature/followingAccounts/followingAccountSlice";
import FollowerAccountItem from "./FollowerAccountItem";
import { Search } from "lucide-react";
import { getFollowingAccounts } from "../feature/followingAccounts/followingAccountSlice";


function AllAccounts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeFollowerAccounts = useSelector(
    (state) => state.followingAccountReducer.followerAccounts
  );
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect (() => {
    if (dispatch(getFollowingAccounts())){
      dispatch(getAllAccounts());
    }
    }, [dispatch, getFollowingAccounts, getAllAccounts])

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    dispatch(getFollowingAccounts());
   // dispatch(getAllAccounts());
        
    
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
      {/* Animated background elements */}
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

      {/* Content container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1152px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 50}px)`,
          transition: 'transform 1s, opacity 1s'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            marginRight: '1rem'
          }}>
            <Search size={40} style={{ color: '#b45309' }} />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            letterSpacing: '-0.025em'
          }}>Find Friends</h1>
        </div>

        {/* Account list content */}
        <div style={{ 
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          backdropFilter: 'blur(4px)',
          padding: '1.5rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.4s'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 0.5rem'
          }}>
            <tbody>
              {storeFollowerAccounts ? (
                storeFollowerAccounts.map((followerAccount) => {
                  return (
                    <FollowerAccountItem
                      key={followerAccount.id}
                      id={followerAccount.id}
                      firstName={followerAccount.firstName}
                      lastName={followerAccount.lastName}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'rgba(255, 243, 232, 0.9)'
                  }}>
                    No accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllAccounts;