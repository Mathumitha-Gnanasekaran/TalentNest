import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Tabs, Tab, Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import logo from "./assets/food.png";
import { useDispatch, useSelector } from "react-redux";
import PostItem from "./PostItem";
import { getProfilePosts } from "../feature/checkProfile/checkProfileSlice";
import { getProfileInfo } from "../feature/checkProfile/checkProfileSlice";

import {
  RiNewspaperLine,
  RiRadarLine,
  RiBaseStationLine,
  RiFolderUserLine,
  RiLogoutBoxLine,
  RiFileSearchLine,
} from "react-icons/ri";

import styles from "./styles/NewsFeed.module.css";

function NewsFeed() {
  let navigate = useNavigate();
  // const [tabValue, setTabValue] = useState("All");

  function handleClick(e) {
    navigate("/newsfeed/allaccounts");
  }

  function handleSignOut(e) {
    localStorage.removeItem("psnUserId");
    localStorage.removeItem("psnToken");
    localStorage.removeItem("psnUserFirstName");
    localStorage.removeItem("psnUserLastName");
    localStorage.removeItem("psnUserEmail");
    navigate("/s");
  }
  const postList = useSelector((state) => state.checkProfileReducer.postList);
  const userInfo = useSelector(
    (state) => state.checkProfileReducer.profileInfo
  );
  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
  });

  return (
    <Container className="pt-3">
      <Row className="mb-3">
        <Col md={12}>
          <Row className="justify-content-center align-items-center">
            <Col md={1} className="text-sm-start text-center mb-sm-0 mb-3">
              <img src={logo} width="100" alt="logo" />
            </Col>
            <Col md={2} className="text-sm-start text-flex-start text-success mb-sm-0 mb-3" >
              <h1 style={{ color: "#191970" }} className="text-sm-start text-flex-start mb-sm-0 mb-3">BINGO</h1>
            </Col>
            <Col md={6}  >
        <Navbar style={{ padding: "10px" }} className="text-sm-start text-flex-start text-success mb-sm-0 mb-3">
          <Container className={styles.navbarContainer}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="navbar-collapse">
              <Nav className={styles.navContainer} >
                  <div style={{ display: 'flex', justifyContent: "space-around",width:"200px" }} className="w-100" >
                    <Nav.Link  >
                      <Link to="" className="text-decoration-none" style={{ color: "blue",width:"200px" }}>
                        <li className="list-group-item fs-5 py-3 text-success shadow" style={{ width: "150px",padding:"10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <span style={{color:"#000080",width:"200px"}}>
                            {" "}
                            <RiNewspaperLine />
                             Newsfeed
                          </span>
                        </li>
                      </Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Link to="following" className="text-decoration-none">
                        <li className="list-group-item fs-5 py-3 text-success shadow" style={{  width: "150px",padding:"10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <span style={{color:"#000080",width:"200px"}}>
                            <RiRadarLine /> 
                            Following
                          </span>
                        </li>
                      </Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Link to="follower" className="text-decoration-none">
                        <li className="list-group-item fs-5 py-3 text-success shadow" style={{  width: "150px",padding:"10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <span style={{color:"#000080",width:"200px"}}>
                            <RiBaseStationLine /> 
                            Followers
                          </span>
                        </li>
                      </Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Link to="myprofile" className="text-decoration-none">
                        <li className="list-group-item fs-5 py-3 text-success shadow" style={{  width: "150px",padding:"10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <span style={{color:"#000080",width:"200px"}}>
                            <RiFolderUserLine />
                             Profile
                          </span>
                        </li>
                      </Link>
                    </Nav.Link>
                    <Nav.Link>
                      <li
                        className={`list-group-item fs-5 py-3 text-success shadow ${styles.signOutButton}`}
                        onClick={handleSignOut}
                        style={{ width: "150px",padding:"10px", display: "flex", justifyContent: "center", alignItems: "center" }}
                      >
                        <span style={{color:"#000080",width:"200px"}}>
                          <RiLogoutBoxLine /> 
                          Sign Out
                        </span>
                      </li>
                    </Nav.Link>
                    <Nav.Link>
                      <li
                        className={`list-group-item fs-5 py-3 text-success shadow ${styles.signOutButton}`}
                        onClick={handleClick}
                        style={{  width: "150px",padding:"10px", display: "flex", justifyContent: "center", alignItems: "center" }}
                      >
                        <span style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", color:"#000080" }}className="icon" >
                          {/* <RiLogoutBoxLine />  */}
                         <RiFileSearchLine size={30} alignItems={ "center"} />
                        </span>
                      </li>
                    </Nav.Link>
                  </div>
                  <div className="list-grup row"  >
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* <h1 style={{justifyContent:"flex-end"}}>Hiiii</h1> */}
        </Col>
        {/* <Col md={2} className="text-sm-start text-flex-start text-success mb-sm-0 mb-3">
              <h1 style={{ color: "violet" }}>PAF</h1>
            </Col> */}
        <Col md={3}  className="text-sm-start text-flex-start text-success mb-sm-0 mb-3">
        {/* <h2 style={{ justifyContent: "flex-end", margin: "0 10px" }}>{userInfo.firstName} {userInfo.lastName}</h2> */}
        </Col>
        {/* <Col  md={3}>
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <Button variant="success" onClick={handleClick} style={{ backgroundColor: "#3d85c6" }}>
              Find All User Accounts
            </Button>
          </div>
        </Col> */}
       
          </Row>
        </Col>
        <div>

        {/* <Row> */}
      
        {/* </Row> */}
      </div>
        {/* <Row> */}
        
        {/* <Col md={4}>
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <Button variant="success" onClick={handleClick}>
              Find All User Accounts
            </Button>
          </div>
        </Col> */}
      {/* </Row> */}
        </Row>
       
      <Row className="mb-3">
        <Col md={8}>
          {/* <Row className="justify-content-center align-items-center">
            <Col md="auto" className="text-sm-start text-center mb-sm-0 mb-3">
              <img src={logo} width="125" alt="logo" />
            </Col>
            <Col className="text-sm-start text-center text-success mb-sm-0 mb-3">
              <h1>PAF</h1>
            </Col>
          </Row> */}
        </Col>
       
      </Row>

     
      {/* </Col> */}
      <br/>
      <Col md={12}>
        <Outlet 
         style={{color:"#A7C7E7"}}/>{" "}
      </Col>
      {/* </Row> */}
      {/* </Col> */}
    </Container>
  );
}

export default NewsFeed;
