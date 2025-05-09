import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { LineChart as LineChartIcon, BarChart as BarChartIcon, User, Search, Download, Filter, PieChart, List, Grid } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProgressDashboard = ({ userId }) => {
  const [progressItems, setProgressItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCharts, setShowCharts] = useState(false);
  const [selectedChart, setSelectedChart] = useState('progress');
  const dashboardRef = useRef(null);
  
  // Fetch all progress items for the user
  const fetchProgressItems = async () => {
    const _id = localStorage.getItem("psnUserId");

    try {
      setLoading(true);
      const response = await axios.post(
        '/api/v1/progress/following',
        { id: _id },
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
  
      if (response.data.status === 'success') {
        // Extract progress items from the new data structure
        const items = response.data.payload || [];
        // Transform the data to have consistent format
        const formattedItems = items.map(item => ({
          ...item.progress,
          user: item.user
        }));
        
        setProgressItems(formattedItems);
  
        // Extract unique categories
        const uniqueCategories = [...new Set(formattedItems.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch progress items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateProgress = (current, initial, target) => {
    if (target === initial) return 0;
    const progress = ((current - initial) / (target - initial)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  };
  
  const getFilteredItems = () => {
    let filtered = progressItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.user && (
          item.user.firstName.toLowerCase().includes(query) ||
          item.user.lastName.toLowerCase().includes(query) ||
          item.user.email.toLowerCase().includes(query)
        ))
      );
    }
    
    return filtered;
  };
  
  const getStats = () => {
    const filteredItems = getFilteredItems();
    
    const stats = {
      total: filteredItems.length,
      completed: filteredItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) >= 100
      ).length,
      inProgress: filteredItems.filter(item => {
        const progress = calculateProgress(item.currentValue, item.initialValue, item.targetValue);
        return progress > 0 && progress < 100;
      }).length,
      notStarted: filteredItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) === 0
      ).length
    };
    
    return stats;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getProgressChartData = () => {
    const filteredItems = getFilteredItems();
    return filteredItems.map(item => ({
      name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
      progress: calculateProgress(item.currentValue, item.initialValue, item.targetValue),
      user: item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown',
      current: item.currentValue,
      target: item.targetValue,
      unit: item.unit
    }));
  };
  
  const getCategoryChartData = () => {
    const filteredItems = getFilteredItems();
    const categoryData = {};
    
    filteredItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category]++;
    });
    
    return Object.keys(categoryData).map(category => ({
      name: category,
      value: categoryData[category]
    }));
  };
  
  const getCompletionChartData = () => {
    const stats = getStats();
    return [
      { name: 'Completed', value: stats.completed, color: '#22c55e' },
      { name: 'In Progress', value: stats.inProgress, color: '#facc15' },
      { name: 'Not Started', value: stats.notStarted, color: '#f87171' }
    ];
  };
  
  const downloadPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.style.position = 'fixed';
      loadingOverlay.style.top = '0';
      loadingOverlay.style.left = '0';
      loadingOverlay.style.width = '100%';
      loadingOverlay.style.height = '100%';
      loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      loadingOverlay.style.display = 'flex';
      loadingOverlay.style.justifyContent = 'center';
      loadingOverlay.style.alignItems = 'center';
      loadingOverlay.style.zIndex = '9999';
      loadingOverlay.innerHTML = '<div style="color: white; font-size: 20px;">Generating PDF...</div>';
      document.body.appendChild(loadingOverlay);
      
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.setFontSize(16);
      pdf.setTextColor(0);
      pdf.text('Progress Dashboard Report', pdfWidth / 2, 10, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth / 2, 15, { align: 'center' });
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
      
      const stats = getStats();
      let yPos = 20 + imgHeight + 10;
      
      pdf.setFontSize(12);
      pdf.text('Summary:', 10, yPos);
      yPos += 5;
      
      pdf.setFontSize(10);
      pdf.text(`Total Progress Items: ${stats.total}`, 10, yPos);
      yPos += 5;
      pdf.text(`Completed: ${stats.completed}`, 10, yPos);
      yPos += 5;
      pdf.text(`In Progress: ${stats.inProgress}`, 10, yPos);
      yPos += 5;
      pdf.text(`Not Started: ${stats.notStarted}`, 10, yPos);
      
      pdf.save('progress-dashboard.pdf');
      
      document.body.removeChild(loadingOverlay);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  useEffect(() => {
    fetchProgressItems();
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [userId]);
  
  const filteredItems = getFilteredItems();
  const stats = getStats();
  
  return (
    <div ref={dashboardRef} style={{
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
      {/* Background decorative elements */}
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

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
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
          <LineChartIcon size={32} style={{ color: '#b45309' }} />
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#ffff',
          margin: 0
        }}>PROGRESS DASHBOARD</h1>
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        width: '100%',
        maxWidth: '1000px',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2rem',
          padding: '0.3rem 1rem',
          alignItems: 'center',
          flex: '1',
          minWidth: '200px',
          maxWidth: '500px',
          backdropFilter: 'blur(5px)'
        }}>
          <Search size={18} style={{ color: '#ffff', marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search progress items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffff',
              outline: 'none',
              width: '100%',
              fontSize: '0.9rem'
            }}
          />
        </div>
        
        {/* Right buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          {/* View toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2rem',
            overflow: 'hidden',
            backdropFilter: 'blur(5px)'
          }}>
            <button
              style={{
                backgroundColor: viewMode === 'grid' ? '#f97316' : 'transparent',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                color: '#ffff',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              style={{
                backgroundColor: viewMode === 'list' ? '#f97316' : 'transparent',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                color: '#ffff',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
          
          {/* Charts toggle */}
          <button
            style={{
              backgroundColor: showCharts ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '2rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: '#ffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
            onClick={() => setShowCharts(!showCharts)}
          >
            <BarChartIcon size={18} />
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
          
          {/* PDF Download button */}
          <button
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '2rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: '#ffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
            onClick={downloadPDF}
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main content container */}
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.1s'
      }}>
        <div style={{
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Track and visualize your progress across different categories</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem',
            borderLeft: '4px solid #f87171',
            backdropFilter: 'blur(5px)'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem'
          }}>
            <Spinner animation="border" style={{ color: '#d97706' }} />
          </div>
        ) : progressItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            backdropFilter: 'blur(5px)'
          }}>
            <p style={{ color: '#ffff', fontSize: '1.125rem' }}>No progress items found. Start by creating your first progress tracker.</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.2s'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>Total</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#f97316' }}>{stats.total}</p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>Completed</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#22c55e' }}>{stats.completed}</p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>In Progress</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#facc15' }}>{stats.inProgress}</p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>Not Started</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#f87171' }}>{stats.notStarted}</p>
              </div>
            </div>
            
            {/* Charts Section */}
            {showCharts && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                {/* Chart type selector */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: selectedChart === 'progress' ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffff',
                      border: 'none',
                      borderRadius: '2rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => setSelectedChart('progress')}
                  >
                    <BarChartIcon size={16} />
                    Progress Chart
                  </button>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: selectedChart === 'category' ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffff',
                      border: 'none',
                      borderRadius: '2rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => setSelectedChart('category')}
                  >
                    <PieChart size={16} />
                    Category Distribution
                  </button>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: selectedChart === 'completion' ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffff',
                      border: 'none',
                      borderRadius: '2rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => setSelectedChart('completion')}
                  >
                    <LineChartIcon size={16} />
                    Completion Status
                  </button>
                </div>
                
                {/* Chart display area */}
                <div style={{ 
                  height: '400px',
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  {selectedChart === 'progress' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getProgressChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#ffff', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          tick={{ fill: '#ffff', fontSize: 12 }}
                          domain={[0, 100]}
                          label={{ 
                            value: 'Progress (%)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fill: '#ffff', fontSize: 12 }
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            borderColor: '#f97316',
                            color: '#ffff'
                          }}
                          formatter={(value, name) => [`${value.toFixed(1)}%`, 'Progress']}
                          labelFormatter={(label) => `Item: ${label}`}
                        />
                        <Bar dataKey="progress" fill="#f97316" radius={[4, 4, 0, 0]}>
                          {getProgressChartData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                entry.progress >= 100 ? '#22c55e' : 
                                entry.progress > 50 ? '#facc15' : 
                                entry.progress > 25 ? '#fb923c' : '#f87171'
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  
                  {selectedChart === 'category' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={getCategoryChartData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          fill="#f97316"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {getCategoryChartData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={[
                                '#f97316', '#22c55e', '#facc15', '#f87171', 
                                '#60a5fa', '#c084fc', '#34d399', '#fbbf24'
                              ][index % 8]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            borderColor: '#f97316',
                            color: '#ffff'
                          }}
                          formatter={(value) => [value, 'Items']}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          wrapperStyle={{ color: '#ffff' }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                  
                  {selectedChart === 'completion' && (
  <ResponsiveContainer width="100%" height="100%">
    <RechartsPieChart>
      <Pie
        data={getCompletionChartData()}
        cx="50%"
        cy="50%"
        outerRadius={120}
        innerRadius={60}
        fill="#f97316"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        labelLine={false}
      >
        {getCompletionChartData().map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color} 
          />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#f97316',
          color: '#ffff'
        }}
        formatter={(value) => [value, 'Items']}
      />
      <Legend 
        verticalAlign="bottom" 
        height={36} 
        wrapperStyle={{ color: '#ffff' }}
      />
    </RechartsPieChart>
  </ResponsiveContainer>
)}
                </div>
                
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {selectedChart === 'progress' && 
                    "This chart shows the progress percentage for each tracked item."}
                  {selectedChart === 'category' && 
                    "This chart shows the distribution of progress items across different categories."}
                  {selectedChart === 'completion' && 
                    "This chart shows the distribution of items by completion status."}
                </div>
              </div>
            )}
            
            {/* Category Filters Header */}
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
                Categories
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
            
            {/* Category Filters */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 5}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.3s'
            }}>
              <button 
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: selectedCategory === 'all' ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffff',
                  border: selectedCategory === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)'
                }}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              
              {categories.map((category) => (
                <button 
                  key={category} 
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: selectedCategory === category ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffff',
                    border: selectedCategory === category ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === category ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)'
                  }}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Progress List Header */}
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
                Progress Items
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
            
            {/* Progress List - Grid View */}
            {viewMode === 'grid' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
              }}>
                {filteredItems.map((progress, index) => {
                  const progressPercent = calculateProgress(
                    progress.currentValue,
                    progress.initialValue,
                    progress.targetValue
                  );
                  
                  const progressColor = 
                    progressPercent >= 100 ? '#22c55e' : 
                    progressPercent > 50 ? '#facc15' : 
                    progressPercent > 25 ? '#fb923c' : '#f87171';
                  
                  return (
                    <div 
                      key={progress.id} 
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        backdropFilter: 'blur(5px)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                        opacity: animationProgress / 100,
                        transition: 'transform 0.8s, opacity 0.8s',
                        transitionDelay: `${0.3 + index * 0.05}s`
                      }}
                    >
                      {/* User info */}
                      {progress.user && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '1rem',
                          padding: '0.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '0.5rem'
                        }}>
                          <div style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            backgroundColor: '#f97316',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '0.75rem'
                          }}>
                            <User size={18} color="#fff" />
                          </div>
                          <div>
                            <div style={{
                              fontWeight: 'bold',
                              fontSize: '0.9rem'
                            }}>
                              {progress.user.firstName} {progress.user.lastName}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              opacity: 0.7
                            }}>
                              {progress.user.email}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <h3 style={{ 
                        margin: '0 0 0.75rem', 
                        fontSize: '1.25rem',
                        color: '#ffff',
                        fontWeight: 'bold'
                      }}>
                        {progress.title}
                      </h3>
                      
                      {progress.category && (
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          color: '#ffff',
                          borderRadius: '1rem',
                          fontSize: '0.8rem',
                          marginBottom: '1rem'
                        }}>
                          {progress.category}
                        </span>
                      )}
                      
                      <div style={{
                        height: '0.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.25rem',
                        overflow: 'hidden',
                        margin: '1rem 0',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: `${progressPercent}%`,
                          height: '100%',
                          backgroundColor: progressColor,
                          borderRadius: '0.25rem',
                          transition: 'width 1s ease-in-out',
                        }} />
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}>
                        <div>{progress.currentValue} {progress.unit}</div>
                        <div>{progress.targetValue} {progress.unit}</div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1.5rem',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        <div>Updated: {formatDate(progress.updatedAt)}</div>
                        <div style={{
                          backgroundColor: progressColor,
                          color: '#000',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}>
                          {Math.round(progressPercent)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Progress List - List View */}
            {viewMode === 'list' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '3rem'
              }}>
                {filteredItems.map((progress, index) => {
                  const progressPercent = calculateProgress(
                    progress.currentValue,
                    progress.initialValue,
                    progress.targetValue
                  );
                  
                  const progressColor = 
                    progressPercent >= 100 ? '#22c55e' : 
                    progressPercent > 50 ? '#facc15' : 
                    progressPercent > 25 ? '#fb923c' : '#f87171';
                  
                  return (
                    <div 
                      key={progress.id} 
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '1rem',
                        padding: '1rem',
                        backdropFilter: 'blur(5px)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                        opacity: animationProgress / 100,
                        transition: 'transform 0.8s, opacity 0.8s',
                        transitionDelay: `${0.3 + index * 0.05}s`
                      }}
                    >
                      {/* User info */}
                      {progress.user && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '0.5rem',
                          marginRight: '1rem',
                          flexShrink: 0
                        }}>
                          <div style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            backgroundColor: '#f97316',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <User size={18} color="#fff" />
                          </div>
                        </div>
                      )}
                      
                      <div style={{ flex: '1' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <h3 style={{ 
                            margin: '0',
                            fontSize: '1.1rem',
                            color: '#ffff',
                            fontWeight: 'bold'
                          }}>
                            {progress.title}
                          </h3>
                          {progress.category && (
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'rgba(255, 255, 255, 0.15)',
                              color: '#ffff',
                              borderRadius: '1rem',
                              fontSize: '0.8rem'
                            }}>
                              {progress.category}
                            </span>
                          )}
                        </div>
                        
                        <div style={{
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '0.5rem'
                        }}>
                          <div>
                            {progress.user && `${progress.user.firstName} ${progress.user.lastName}`}
                          </div>
                          <div>Updated: {formatDate(progress.updatedAt)}</div>
                        </div>
                        
                        <div style={{
                          height: '0.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '0.25rem',
                          overflow: 'hidden',
                          margin: '0.5rem 0',
                          position: 'relative'
                        }}>
                          <div style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            backgroundColor: progressColor,
                            borderRadius: '0.25rem',
                            transition: 'width 1s ease-in-out',
                          }} />
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                          <div>{progress.currentValue} {progress.unit} of {progress.targetValue} {progress.unit}</div>
                          <div style={{
                            backgroundColor: progressColor,
                            color: '#000',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                          }}>
                            {Math.round(progressPercent)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
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
      
      {/* Floating decorative elements */}
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
};

export default ProgressDashboard;