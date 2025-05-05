package com.linhtch90.psnbackend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.CommentEntity;
import com.linhtch90.psnbackend.entity.IdObjectEntity;
import com.linhtch90.psnbackend.entity.PostEntity;
import com.linhtch90.psnbackend.entity.UserEntity;
import com.linhtch90.psnbackend.repository.CommentRepository;
import com.linhtch90.psnbackend.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private PostRepository postRepo;

    @Autowired
    private PostService postService;

    public ResponseObjectService insertComment(CommentEntity inputComment, String inputPostId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(inputPostId);
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find target post id: " + inputPostId);
            responseObj.setPayload(null);
            return responseObj;
        } else {
            inputComment.setCreatedAt(Instant.now());
            commentRepo.save(inputComment);
            PostEntity targetPost = optPost.get();
            List<CommentEntity> commentList = targetPost.getComment();
            if (commentList == null) {
                commentList = new ArrayList<>();
            }
            commentList.add(inputComment);
            targetPost.setComment(commentList);
            postService.updatePostByComment(targetPost);
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            responseObj.setPayload(inputComment);
            return responseObj;
        }
    }

    public ResponseObjectService getComments(String inputPostId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optTargetPost = postRepo.findById(inputPostId);
        if (optTargetPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("fail");
            responseObj.setPayload(null);
            return responseObj;
        } else {
            PostEntity targetPost = optTargetPost.get();
            List<CommentEntity> commentList = targetPost.getComment();
            if (commentList.size() > 0) {
                responseObj.setStatus("success");
                responseObj.setMessage("success");
                responseObj.setPayload(commentList);
                return responseObj;
            } else {
                responseObj.setStatus("success");
                responseObj.setMessage("Post id " + inputPostId + " does not have any comment");
                responseObj.setPayload(null);
                return responseObj;
            }
        }
    }
    public ResponseObjectService getAllComments() {
        ResponseObjectService responseObj = new ResponseObjectService();
        responseObj.setPayload(commentRepo.findAll());
        responseObj.setStatus("success");
        responseObj.setMessage("success");
        return responseObj;
    }

    public ResponseObjectService editUserComment(CommentEntity inputComment, String inputPostId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(inputPostId);
//        Optional<PostEntity> optPost = postRepo.findById("645c8e899dc0394c96ce28d8");
//        Optional<CommentEntity> optPosts = commentRepo.findById("645c8e899dc0394c96ce28d8");

//        System.out.println(optPost+"    "+" timing boss");
//        inputPostId645c8ee59dc0394c96ce28da
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find target post id: " + inputPostId);
            responseObj.setPayload(null);
            return responseObj;
        } else {
            inputComment.setCreatedAt(Instant.now());
            commentRepo.save(inputComment);
            PostEntity targetPost = optPost.get();
            List<CommentEntity> commentList = targetPost.getComment();
            if (commentList == null) {
                commentList = new ArrayList<>();
            }
//            System.out.println(inputComment);
//            commentList.set(0, inputComment);
            for (int i = 0; i < commentList.size(); i++) {
                System.out.println(commentList.get(i).getId()+ "  " + inputComment.getId() );
                if (commentList.get(i).getId().equals(inputComment.getId())) {
                    System.out.println("welcome");
                    commentList.set(i, inputComment);
                }else{
                    System.out.println("fails");
                }
            }
            targetPost.setComment(commentList);
            System.out.println("targetPost   "+ commentList);
            postService.updateEditPostByComment(targetPost);
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            responseObj.setPayload(targetPost);
            return responseObj;
        }
    }

    public ResponseObjectService deleteUserComment(CommentEntity inputComment, String inputPostId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(inputPostId);
//        Optional<PostEntity> optPost = postRepo.findById("645c8e899dc0394c96ce28d8");
//        Optional<CommentEntity> optPosts = commentRepo.findById("645c8e899dc0394c96ce28d8");

//        System.out.println(optPost+"    "+" timing boss");
//        inputPostId645c8ee59dc0394c96ce28da
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find target post id: " + inputPostId);
            responseObj.setPayload(null);
            return responseObj;
        } else {
            inputComment.setCreatedAt(Instant.now());
            commentRepo.save(inputComment);
            PostEntity targetPost = optPost.get();
            List<CommentEntity> commentList = targetPost.getComment();
            if (commentList == null) {
                commentList = new ArrayList<>();
            }
//            System.out.println(inputComment);
//            commentList.set(0, inputComment);
            for (int i = 0; i < commentList.size(); i++) {
                System.out.println(commentList.get(i).getId()+ "  " + inputComment.getId() );
                if (commentList.get(i).getId().equals(inputComment.getId())) {
                    System.out.println("welcome 21");
                    commentList.remove(i);
                    System.out.println("Comment removed successfully.");
                }else{
                    System.out.println("fails 2");
                }
            }
            targetPost.setComment(commentList);
            System.out.println("targetPost   "+ commentList);
            postService.updateEditPostByComment(targetPost);
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            responseObj.setPayload(commentList);
            return responseObj;
        }
    }

}
