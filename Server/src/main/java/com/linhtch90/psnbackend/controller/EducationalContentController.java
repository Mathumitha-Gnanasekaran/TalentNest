package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.EducationalContentEntity;
import com.linhtch90.psnbackend.entity.EducationalContentRequest;
import com.linhtch90.psnbackend.entity.IdObjectEntity;
import com.linhtch90.psnbackend.service.EducationalContentService;
import com.linhtch90.psnbackend.service.ResponseObjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/educational")
public class EducationalContentController {
    @Autowired
    private EducationalContentService educationalContentService;

    @PostMapping("/create")
    public ResponseEntity<ResponseObjectService> createContent(@RequestBody EducationalContentEntity content) {
        return new ResponseEntity<>(educationalContentService.createContent(content), HttpStatus.OK);
    }

    @PostMapping("/user")
    public ResponseEntity<ResponseObjectService> getUserContent(@RequestBody IdObjectEntity userId) {
        return new ResponseEntity<>(educationalContentService.getUserContent(userId), HttpStatus.OK);
    }

    @PostMapping("/get")
    public ResponseEntity<ResponseObjectService> getContentById(@RequestBody IdObjectEntity contentId) {
        return new ResponseEntity<>(educationalContentService.getContentById(contentId), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseObjectService> updateContent(@RequestBody EducationalContentEntity content) {
        return new ResponseEntity<>(educationalContentService.updateContent(content), HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<ResponseObjectService> deleteContent(@RequestBody EducationalContentRequest request) {
        return new ResponseEntity<>(educationalContentService.deleteContent(request), HttpStatus.OK);
    }

    @PostMapping("/mark-learned")
    public ResponseEntity<ResponseObjectService> markAsLearned(@RequestBody EducationalContentRequest request) {
        return new ResponseEntity<>(educationalContentService.markAsLearned(request), HttpStatus.OK);
    }

    @PostMapping("/bookmark")
    public ResponseEntity<ResponseObjectService> bookmarkContent(@RequestBody EducationalContentRequest request) {
        return new ResponseEntity<>(educationalContentService.bookmarkContent(request), HttpStatus.OK);
    }

    @PostMapping("/learned")
    public ResponseEntity<ResponseObjectService> getLearnedContent(@RequestBody IdObjectEntity userId) {
        return new ResponseEntity<>(educationalContentService.getLearnedContent(userId), HttpStatus.OK);
    }

    @PostMapping("/bookmarked")
    public ResponseEntity<ResponseObjectService> getBookmarkedContent(@RequestBody IdObjectEntity userId) {
        return new ResponseEntity<>(educationalContentService.getBookmarkedContent(userId), HttpStatus.OK);
    }

    @PostMapping("/following")
    public ResponseEntity<ResponseObjectService> getFollowingContent(@RequestBody IdObjectEntity userId) {
        return new ResponseEntity<>(educationalContentService.getFollowingContent(userId), HttpStatus.OK);
    }
}