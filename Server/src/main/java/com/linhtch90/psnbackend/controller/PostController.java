package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.*;
import com.linhtch90.psnbackend.service.PostService;
import com.linhtch90.psnbackend.service.ResponseObjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class PostController {
    @Autowired
    private PostService postService;
    @PostMapping("/allposts")
    public ResponseEntity<ResponseObjectService> findAllUsers() {
        System.out.println("hiihi");
        return new ResponseEntity<ResponseObjectService>(postService.findAll(), HttpStatus.OK);
    }
    @PostMapping("/insertpost")
    public ResponseEntity<ResponseObjectService> insertPost(@RequestBody PostEntity inputPost) {
        return new ResponseEntity<ResponseObjectService>(postService.insertPost(inputPost), HttpStatus.OK);
    }
    @DeleteMapping("/deletepost")
    public ResponseEntity<ResponseObjectService> deletePost(@RequestBody IdObjectEntity inputUserId) {
        System.out.println("Deleting post with ID: " + inputUserId.getId());
        ResponseObjectService response = postService.deleteUserPost(inputUserId);
        return new ResponseEntity<>(response,
                response.getStatus().equals("success") ?
                        HttpStatus.OK : HttpStatus.NOT_FOUND);
    }

    @PutMapping("/editpost")
    public ResponseEntity<ResponseObjectService> deletePost(@RequestBody PostEntity inputPost) {
        System.out.println(inputPost);
        System.out.println("inputUserId");

        return new ResponseEntity<ResponseObjectService>(postService.editUserPost(inputPost), HttpStatus.OK);
    }
    
    @PostMapping("/myposts")
    public ResponseEntity<ResponseObjectService> findPostByUserId(@RequestBody IdObjectEntity inputUserId) {
        return new ResponseEntity<ResponseObjectService>(postService.findPostByUserId(inputUserId), HttpStatus.OK);
    }

    @PostMapping("/followingposts")
    public ResponseEntity<ResponseObjectService> findPostByFollowing(@RequestBody IdObjectEntity inputUserId) {
        return new ResponseEntity<ResponseObjectService>(postService.findPostByFollowing(inputUserId), HttpStatus.OK);
    }

    // currently not in use, post is update via comment controller
    // @PutMapping("/updatebycomment")
    // public ResponseEntity<ResponseObjectService> updateByComment(@RequestBody PostEntity inputPost) {
    //     return new ResponseEntity<ResponseObjectService>(postService.updatePostByComment(inputPost), HttpStatus.OK);
    // }

    @PostMapping("/lovepost")
    public ResponseEntity<ResponseObjectService> lovePost(@RequestBody DoubleIdObjectEntity doubleId) {
        return new ResponseEntity<ResponseObjectService>(postService.updatePostByLove(doubleId), HttpStatus.OK);
    }

    @PostMapping("/sharepost")
    public ResponseEntity<ResponseObjectService> sharePost(@RequestBody DoubleIdObjectEntity doubleId) {
        return new ResponseEntity<ResponseObjectService>(postService.updatePostByShare(doubleId), HttpStatus.OK);
    }
    @PostMapping("/savepost")
    public ResponseEntity<ResponseObjectService> savePost(@RequestBody SavePostRequest request) {
        return new ResponseEntity<>(postService.savePost(request), HttpStatus.OK);
    }

    @PostMapping("/unsavepost")
    public ResponseEntity<ResponseObjectService> unsavePost(@RequestBody SavePostRequest request) {
        return new ResponseEntity<>(postService.unsavePost(request), HttpStatus.OK);
    }

    @PostMapping("/savedposts")
    public ResponseEntity<ResponseObjectService> getSavedPosts(@RequestBody IdObjectEntity userId) {
        return new ResponseEntity<>(postService.getSavedPosts(userId), HttpStatus.OK);
    }

    @PostMapping("/ispostsaved")
    public ResponseEntity<ResponseObjectService> isPostSaved(@RequestBody SavePostRequest request) {
        return new ResponseEntity<>(postService.isPostSaved(request), HttpStatus.OK);
    }

    // Add these endpoints to the existing PostController class

    @PostMapping("/progress/create")
    public ResponseEntity<ResponseObjectService> createProgress(@RequestBody ProgressEntity progress) {
        return new ResponseEntity<>(postService.createProgress(progress), HttpStatus.OK);
    }

    @PostMapping("/progress/user")
    public ResponseEntity<ResponseObjectService> getUserProgress(@RequestBody IdObjectEntity userId) {
        return new ResponseEntity<>(postService.getUserProgress(userId), HttpStatus.OK);
    }

    @PostMapping("/progress/get")
    public ResponseEntity<ResponseObjectService> getProgressById(@RequestBody DoubleIdObjectEntity ids) {
        return new ResponseEntity<>(postService.getProgressById(ids), HttpStatus.OK);
    }

    @PutMapping("/progress/update")
    public ResponseEntity<ResponseObjectService> updateProgress(@RequestBody ProgressEntity progress) {
        return new ResponseEntity<>(postService.updateProgress(progress), HttpStatus.OK);
    }

    @PostMapping("/progress/delete")
    public ResponseEntity<ResponseObjectService> deleteProgress(@RequestBody DoubleIdObjectEntity ids) {
        return new ResponseEntity<>(postService.deleteProgress(ids), HttpStatus.OK);
    }

    @PostMapping("/progress/following")
    public ResponseEntity<ResponseObjectService> getFollowingProgress(@RequestBody IdObjectEntity userId) {
        return new ResponseEntity<>(postService.getFollowingProgress(userId), HttpStatus.OK);
    }
}
