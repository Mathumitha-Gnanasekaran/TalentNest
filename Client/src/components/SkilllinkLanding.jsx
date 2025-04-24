import { useState, useEffect } from 'react';
import { ChevronRight, Utensils, Users, Book, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookingSkillsLanding() {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
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
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated background elements - cooking themed */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }}>
        {/* Circular elements representing ingredients */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: 'white',
              opacity: 0.1,
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

      {/* Content container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1152px',
        padding: '4rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Logo and name */}
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
            <Utensils size={40} style={{ color: '#b45309' }} />
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            letterSpacing: '-0.025em'
          }}>COOKSHARE</h1>
        </div>

        {/* Main headline */}
        <h2 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1.5rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 40}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.2s'
        }}>
          Cook. Share. Inspire.
        </h2>

        {/* Description */}
        <p style={{ 
          fontSize: '1.25rem',
          textAlign: 'center',
          maxWidth: '48rem',
          marginBottom: '3rem',
          color: 'rgba(255, 243, 232, 0.9)',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.4s'
        }}>
          COOKSHARE is a community where passionate foodies connect to share recipes, 
          cooking techniques, and culinary expertise from around the world.
        </p>

        {/* Feature highlights */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          width: '100%',
          marginBottom: '3rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.6s',
          '@media (min-width: 768px)': {
            gridTemplateColumns: '1fr 1fr 1fr'
          }
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(4px)'
          }}>
            <Users style={{ color: '#fbbf24', marginBottom: '1rem' }} size={32} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Global Kitchen</h3>
            <p style={{ color: 'rgba(255, 243, 232, 0.9)' }}>Connect with chefs and home cooks from around the world sharing authentic recipes.</p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(4px)'
          }}>
            <Book style={{ color: '#fbbf24', marginBottom: '1rem' }} size={32} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Recipe Collection</h3>
            <p style={{ color: 'rgba(255, 243, 232, 0.9)' }}>Discover thousands of recipes from everyday meals to gourmet creations.</p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(4px)'
          }}>
            <Clock style={{ color: '#fbbf24', marginBottom: '1rem' }} size={32} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Live Workshops</h3>
            <p style={{ color: 'rgba(255, 243, 232, 0.9)' }}>Join virtual cooking sessions with expert chefs and learn new techniques in real-time.</p>
          </div>
        </div>

        {/* CTA Button */}
        <button style={{ 
          background: 'linear-gradient(to right, #92400e, #d97706)',
          color: 'white',
          fontWeight: 'bold',
          padding: '1rem 2rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.25rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transform: `translateY(${(1 - animationProgress / 100) * 10}px) scale(1)`,
          opacity: animationProgress / 100,
          transition: 'all 0.3s ease',
          transitionDelay: '0.8s',
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Link style={{textDecoration:'none', color:'white'}} to="/s">
            <span>Start Cooking</span>
          </Link> 
          <ChevronRight style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    </div>
  );
}