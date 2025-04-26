import React, { useState } from "react";

import { Hashicon } from "@emeraldpay/hashicon-react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Foot from "../components/components/Foot"
import {
  RiHeartFill,
  RiHeartLine,
  RiMessage2Fill,
  RiShareForwardFill,
  RiSendPlane2Fill
} from "react-icons/ri";
import { AiFillEdit } from 'react-icons/fa';
import { FaBeer } from 'react-icons/fa';
import { AiFillDelete } from "react-icons/ai";

import { Button, Col, Form, Row } from "react-bootstrap";

import styles from "./styles/PostItem.module.css";
import { useDispatch } from "react-redux";
import {
  addLove,
  addShare,
  addComment,
  getFollowingPosts,
} from "../feature/followingPost/followingPostSlice";
import { BsFillPencilFill } from "react-icons/bs";
import MultiImageUploadView from "../feature/multiImageUploadView";

function PostItem(props) {
  const dispatch = useDispatch();

  const [loveStatus, setLoveStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [sendButtonDisable, setSendButtonDisable] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("psnUserId")
  );
  const [postId, setPostId] = useState(props.postId);

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  function handleLoveClick(e) {
    if (!props.loveList.includes(currentUserId)) {
      setLoveStatus(true);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    } else {
      setLoveStatus(false);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    }
  }

  function handleShareClick(e) {
    dispatch(addShare({ postId: postId, userId: currentUserId }));
    dispatch(getFollowingPosts());
  }

  function handleCommentButtonClick(e) {
    setCommentStatus(!commentStatus);
  }

  function handleCommentContentChange(e) {
    e.preventDefault();

    setCommentContent(e.target.value);

    if (commentContent.length - 1 > 0 && commentContent.length - 1 <= 100) {
      setSendButtonDisable(false);
    } else {
      setSendButtonDisable(true);
    }
  }



  function sendComment(e) {
    dispatch(
      addComment({
        postId: postId,
        newComment: {
          userId: localStorage.getItem("psnUserId"),
          userFullname:
            localStorage.getItem("psnUserFirstName") +
            " " +
            localStorage.getItem("psnUserLastName"),
          content: commentContent,
        },
      })
    );
    setCommentContent("");
  }

  return (
    <div>
      <div className="card">
        <div className="link" >
          <div className="nav-owner">
            <img src={props.images ? props.images[0] : ""} alt="" className="imgdp" />
            <div>
              <p className="title m-0">{props.firstName + " " + props.lastName}</p>
              <p className="m-0">{timeAgo.format(new Date(props.postDate).getTime())}</p>
            </div>
          </div>
          <MultiImageUploadView images={props.images} />
          <p>{props.content}</p>
          <p className="desc">{props.longDesc}</p>
          {/* <Foot /> */}
          <div className="d-flex justify-content-center align-items-center">
            <div className="mx-3">
              <span
                className={`${styles.loveButton} mx-1 fs-4`}
                onClick={handleLoveClick}
              >
                {loveStatus ? (
                  <RiHeartFill className="text-danger" />
                ) : (
                  <RiHeartLine className="text-danger" />
                )}
              </span>
              <span>
                {props.loveList.length > 0 ? props.loveList.length : null}
              </span>
            </div>
            <div className="mx-3">
              <span
                className={`${styles.commentButton} mx-1 fs-4`}
                onClick={handleCommentButtonClick}
              >
                <RiMessage2Fill className="text-primary" />
              </span>
              <span>
                {props.commentList.length > 0 ? props.commentList.length : null}

              </span>
            </div>
          </div>
          {commentStatus === true ? (
            <div className="mt-3">
              <div className="d-flex align-items-center">
                <Form className="w-100 mx-1">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={handleCommentContentChange}
                    />
                  </Form.Group>
                </Form>
                <span className="mx-1">{commentContent.length}/100</span>
                <div className="ms-auto">
                  <Button
                    variant="success"
                    className="p-1"
                    disabled={sendButtonDisable}
                    onClick={sendComment}
                  >
                    <RiSendPlane2Fill className="fs-4" />
                  </Button>

                </div>
              </div>
              {props.commentList.map((commentItem) => (
                <div className="border rounded border-info my-3 px-2 pb-2">
                  <div className="d-flex align-items-center my-2">
                    <div className="me-auto mx-1">
                      <Hashicon value={commentItem.userId} size={30} />{" "}
                    </div>
                    <div className="w-100 mx-1 fw-bold">
                      <span>{commentItem.userFullname}</span>
                    </div>
                  </div>
                  <div>{commentItem.content}</div>

                </div>
              ))}
            </div>
          ) : (
            <span></span>
          )}
        </div>
      </div>
      {/* <div className="border shadow rounded-3 border-primary p-3 mt-3 centered-div" style={{ width: "700px", margin: "0 auto" }} >
        <Row>
          <div className="d-flex align-items-center justify-content-between  mb-3">
            <div className="d-flex align-items-center mb-3">
              <div className="mx-3">
                <Hashicon value={props.userId} size={50} />
              </div>
              <div className="d-flex flex-column">
                <div className="fw-bold">{props.firstName + " " + props.lastName}</div>
                <div className="text-secondary">{timeAgo.format(new Date(props.postDate).getTime())}</div>
              </div>
            </div>
            {
              props.userId === currentUserId && <div>
                <BsFillPencilFill className="text-primary" style={{ margin: "10px" }} onClick={props.editClick} />
                <AiFillDelete style={{ color: "red", margin: "10px" }} onClick={props.deleteClick} />
              </div>
            }

          </div>
          <div className="mx-3">
            <div>
              <p>{props.content}</p>
            </div>
            {props.images &&
              <MultiImageUploadView images={props.images} />
            }
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="mx-3">
              <span
                className={`${styles.loveButton} mx-1 fs-4`}
                onClick={handleLoveClick}
              >
                {loveStatus ? (
                  <RiHeartFill className="text-danger" />
                ) : (
                  <RiHeartLine className="text-danger" />
                )}
              </span>
              <span>
                {props.loveList.length > 0 ? props.loveList.length : null}
              </span>
            </div>
            <div className="mx-3">
              <span
                className={`${styles.commentButton} mx-1 fs-4`}
                onClick={handleCommentButtonClick}
              >
                <RiMessage2Fill className="text-primary" />
              </span>
              <span>
                {props.commentList.length > 0 ? props.commentList.length : null}

              </span>
            </div>
          </div>
          {commentStatus === true ? (
            <div className="mt-3">
              <div className="d-flex align-items-center">
                <Form className="w-100 mx-1">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={handleCommentContentChange}
                    />
                  </Form.Group>
                </Form>
                <span className="mx-1">{commentContent.length}/100</span>
                <div className="ms-auto">
                  <Button
                    variant="success"
                    className="p-1"
                    disabled={sendButtonDisable}
                    onClick={sendComment}
                  >
                    <RiSendPlane2Fill className="fs-4" />
                  </Button>

                </div>
              </div>
              {props.commentList.map((commentItem) => (
                <div className="border rounded border-info my-3 px-2 pb-2">
                  <div className="d-flex align-items-center my-2">
                    <div className="me-auto mx-1">
                      <Hashicon value={commentItem.userId} size={30} />{" "}
                    </div>
                    <div className="w-100 mx-1 fw-bold">
                      <span>{commentItem.userFullname}</span>
                    </div>
                  </div>
                  <div>{commentItem.content}</div>

                </div>
              ))}
            </div>
          ) : (
            <span></span>
          )}
        </Row>
      </div> */}
    </div>
  );
}

export default PostItem;
