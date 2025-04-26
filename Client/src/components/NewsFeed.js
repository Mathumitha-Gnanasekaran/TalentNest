import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import { AiFillHome, AiOutlineSearch, AiOutlineUserAdd, AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import styles from "./styles/NewsFeed.module.css";
import { RiDashboard2Fill } from "react-icons/ri";
import { CastForEducationOutlined, TrackChanges } from "@mui/icons-material";

function NewsFeed() {
  let navigate = useNavigate();

  function handleSignOut(e) {
    localStorage.removeItem("psnUserId");
    localStorage.removeItem("psnToken");
    localStorage.removeItem("psnUserFirstName");
    localStorage.removeItem("psnUserLastName");
    localStorage.removeItem("psnUserEmail");
    navigate("/s");
  }

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
  });

  return (
    <Container className="pt-3">
      <AppBar sx={{background:' #b45309'}} position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/s" className={styles.navTitle} style={{ textDecoration: "none", color: "inherit" }}>
              COOKSHARE
            </Link>
          </Typography>
          <Box>
            <IconButton color="inherit" component={Link} to="">
              <AiFillHome />
            </IconButton>
            <IconButton color="inherit" component={Link} to="following">
              <BiAddToQueue />
            </IconButton>
            <IconButton color="inherit" component={Link} to="follower">
              <AiOutlineUserAdd />
            </IconButton>
            <IconButton color="inherit" component={Link} to="allaccounts">
              <AiOutlineSearch />
            </IconButton>
            <IconButton color="inherit" component={Link} to="progress">
              <TrackChanges />
            </IconButton>
            <IconButton color="inherit" component={Link} to="dashboard">
              <RiDashboard2Fill />
            </IconButton>
            <IconButton color="inherit" component={Link} to="education">
              <CastForEducationOutlined />
            </IconButton>
            <IconButton color="inherit" component={Link} to="myprofile">
              <AiOutlineSetting />
            </IconButton>
            <IconButton color="inherit" onClick={handleSignOut}>
              <AiOutlineLogout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Row className="mb-3">
        <Col md={8}></Col>
      </Row>
      <br />
      <Col md={12}>
        <Outlet style={{ color: "#A7C7E7" }} />
      </Col>
    </Container>
  );
}


export default NewsFeed;
