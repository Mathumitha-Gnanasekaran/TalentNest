package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.CommentEntity;
import com.linhtch90.psnbackend.entity.CommentPostRequestEntity;
import com.linhtch90.psnbackend.entity.IdObjectEntity;
import com.linhtch90.psnbackend.entity.PostEntity;
import com.linhtch90.psnbackend.service.CommentService;
import com.linhtch90.psnbackend.service.ResponseObjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class CommentController {
    @Autowired
    private CommentService commentService;
    @PostMapping("/insertcomment")
    public ResponseEntity<ResponseObjectService> insertComment(@RequestBody CommentPostRequestEntity postedComment) {
        CommentEntity inputComment = postedComment.getCommentEntity();
        IdObjectEntity inputPostId = postedComment.getPostId();
        return new ResponseEntity<ResponseObjectService>(commentService.insertComment(inputComment, inputPostId.getId()), HttpStatus.OK);
    }

    @PostMapping("/getcomments") 
    public ResponseEntity<ResponseObjectService> getComments(@RequestBody IdObjectEntity inputPostId) {
        return new ResponseEntity<ResponseObjectService>(commentService.getComments(inputPostId.getId()), HttpStatus.OK);
    }

    @PostMapping("/getallcomments")
    public ResponseEntity<ResponseObjectService> getAllComments() {
        return new ResponseEntity<ResponseObjectService>(commentService.getAllComments(), HttpStatus.OK);
    }
    @PutMapping("/editcomment")
    public ResponseEntity<ResponseObjectService> putComment(@RequestBody CommentPostRequestEntity postedComment) {
        System.out.println(postedComment);
        CommentEntity inputComment = postedComment.getCommentEntity();
        IdObjectEntity inputPostId = postedComment.getPostId();
        return new ResponseEntity<ResponseObjectService>(commentService.editUserComment(inputComment, inputPostId.getId()), HttpStatus.OK);

//        return new ResponseEntity<ResponseObjectService>(commentService.editUserComment(inputPost), HttpStatus.OK);
    }
    @PutMapping("/deletecomment")
    public ResponseEntity<ResponseObjectService> deletePost(@RequestBody CommentPostRequestEntity postedComment) {
        System.out.println(postedComment);
        CommentEntity inputComment = postedComment.getCommentEntity();
        IdObjectEntity inputPostId = postedComment.getPostId();

        return new ResponseEntity<ResponseObjectService>(commentService.deleteUserComment(inputComment, inputPostId.getId()), HttpStatus.OK);
    }

}
