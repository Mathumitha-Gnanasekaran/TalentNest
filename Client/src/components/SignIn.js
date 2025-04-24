import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import GoogleAuth from "./googleAuth";
import { RiLoginBoxLine } from "react-icons/ri";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import google from "./assets/images/google.png";
import { Utensils } from 'lucide-react';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SignIn() {
  const Google_ = () => {
    window.open("http://localhost:5000/auth/google", "_self")
  }
  
  const [resData, setResData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  async function postSignInInfoWithGoogle(inputData) {
    let datas = {
      email: inputData.user.email,
      password: "PAF2023@@",
    };
    const response = await axios({
      method: "post",
      url: "/api/v1/users/signin",
      data: datas
    });

    if (response.data !== null && response.data.status === "fail") {
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
    }

    if (response.data !== null && response.data.status === "success") {
      setResData(response.data);

      localStorage.setItem("psnUserId", response.data.payload.user.id);
      localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
      localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
      localStorage.setItem("psnUserEmail", response.data.payload.user.email);
      localStorage.setItem("psnBio", response.data.payload.user.bio);
      localStorage.setItem("psnToken", response.data.payload.token);
      navigate("/newsfeed");
    }
  }
  
  const handleAuth = (data) => {
    postSignInInfoWithGoogle(data)
  }
  
  let navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  async function postSignInInfo(inputData) {
    const response = await axios({
      method: "post",
      url: "/api/v1/users/signin",
      data: {
        email: inputData.email,
        password: inputData.password,
      },
    });

    if (response.data !== null && response.data.status === "fail") {
      setSnackbarMessage("Authentication failed");
      setSnackbarOpen(true);
    }

    if (response.data !== null && response.data.status === "success") {
      setResData(response.data);
      localStorage.setItem("psnUserId", response.data.payload.user.id);
      localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
      localStorage.setItem("psnBio", response.data.payload.user.bio);
      localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
      localStorage.setItem("psnUserEmail", response.data.payload.user.email);
      localStorage.setItem("psnToken", response.data.payload.token);
      navigate("/newsfeed");
    }
  }

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #7c2d12, #b45309)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
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
          marginBottom: '2rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
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
            <Utensils size={32} style={{ color: '#b45309' }} />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            margin: 0
          }}>COOKSHARE</h1>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.2s'
        }}>
          <div style={{
            flex: 1,
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#92400e',
                marginBottom: '0.5rem'
              }}>Welcome Back, Chef!</h2>
              <p style={{
                color: '#78350f',
                fontSize: '1rem'
              }}>Sign in to continue your culinary journey</p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Google Auth button */}
              <div>
                <GoogleAuth handleAuth={handleAuth} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1rem 0'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <div style={{ margin: '0 1rem', color: '#78350f', fontSize: '0.875rem' }}>OR</div>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            <Formik
              validationSchema={schema}
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                postSignInInfo(values);
                setSubmitting(false);
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isInValid,
                errors,
              }) => (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <Row>
                    <Form.Group as={Col} md="12" controlId="signInEmail">
                      <Form.Label style={{ color: "#78350f", fontWeight: '500', marginBottom: '0rem' }}>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={touched.email && errors.email}
                        placeholder="Enter your email"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          width: '100%'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="12" controlId="signInPassword">
                      <Form.Label style={{ color: "#78350f", fontWeight: '500' }}>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={touched.password && errors.password}
                        placeholder="Enter your password"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          width: '100%'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your password
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Button 
                    type="submit" 
                    style={{ 
                      backgroundColor: '#d97706',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginTop: '0.5rem'
                    }}
                  >
                    Sign In <RiLoginBoxLine />
                  </Button>
                  
                  <div style={{ 
                    textAlign: "center", 
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Link to='/signup' style={{ textDecoration: 'none' }}>
                      <Button style={{
                        background: '#059669',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1.5rem',
                        fontWeight: 'bold'
                      }}>
                        Create a New Account
                      </Button>
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right side decorative panel */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #92400e, #ea580c)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0
                }}
              />
            ))}
            
            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>Cook. Share. Inspire.</h2>
              <p style={{
                fontSize: '1.125rem',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Join thousands of passionate chefs and food enthusiasts on the COOKSHARE platform.
                Share your recipes or learn new culinary techniques today.
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '7rem'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>10K+</span>
                  <span style={{ fontSize: '0.875rem' }}>Recipes</span>
                </div>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '7rem'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>5K+</span>
                  <span style={{ fontSize: '0.875rem' }}>Chefs</span>
                </div>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '7rem'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>200+</span>
                  <span style={{ fontSize: '0.875rem' }}>Cuisines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignIn;