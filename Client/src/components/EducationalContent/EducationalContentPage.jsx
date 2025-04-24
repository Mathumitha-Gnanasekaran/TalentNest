import React, { useState, useEffect } from 'react';
import { Utensils, BookOpen } from 'lucide-react';
import EducationalContentShare from './EducationalContentShare';
import EducationalContentFeed from './EducationalContentFeed';
import './EducationalContent.css';

function EducationalContentPage() {
  const userId = localStorage.getItem("psnUserId");
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="app-container">
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Animated food/ingredient elements */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: 'white',
              opacity: 0.08,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${animationProgress / 100})`,
              transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 0.05}s`
            }}
          />
        ))}
        
        {/* Kitchen utensil shapes */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`utensil-${i}`}
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

      {/* Logo and Title */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
        transition: 'transform 1s, opacity 1s',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          marginRight: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <BookOpen size={32} style={{ color: '#b45309' }} />
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>Educational Content</h1>
      </div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <EducationalContentShare userId={userId} />
        
        <div className="content-divider"></div>
        
        <EducationalContentFeed userId={userId} />
      </div>
    </div>
  );
}

export default EducationalContentPage;