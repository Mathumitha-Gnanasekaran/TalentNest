package com.linhtch90.psnbackend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.EducationalContentEntity;
import com.linhtch90.psnbackend.entity.EducationalContentRequest;
import com.linhtch90.psnbackend.entity.IdObjectEntity;
import com.linhtch90.psnbackend.entity.UserEntity;
import com.linhtch90.psnbackend.repository.EducationalContentRepository;
import com.linhtch90.psnbackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EducationalContentService {
    @Autowired
    private EducationalContentRepository educationalContentRepo;

    @Autowired
    private UserRepository userRepo;

    // Create new educational content
    public ResponseObjectService createContent(EducationalContentEntity content) {
        ResponseObjectService responseObj = new ResponseObjectService();
        try {
            Instant now = Instant.now();
            content.setCreatedAt(now);
            content.setUpdatedAt(now);

            EducationalContentEntity savedContent = educationalContentRepo.save(content);

            responseObj.setStatus("success");
            responseObj.setMessage("Educational content created successfully");
            responseObj.setPayload(savedContent);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error creating educational content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Get all educational content for a user
    public ResponseObjectService getUserContent(IdObjectEntity userId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<List<EducationalContentEntity>> contentListOpt =
                    educationalContentRepo.findByUserIdOrderByCreatedAtDesc(userId.getId());

            if (contentListOpt.isPresent()) {
                responseObj.setStatus("success");
                responseObj.setMessage("User educational content retrieved successfully");
                responseObj.setPayload(contentListOpt.get());
            } else {
                responseObj.setStatus("success");
                responseObj.setMessage("No educational content found for this user");
                responseObj.setPayload(new ArrayList<>());
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving educational content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Get a specific educational content by ID
    public ResponseObjectService getContentById(IdObjectEntity contentId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<EducationalContentEntity> contentOpt = educationalContentRepo.findById(contentId.getId());

            if (contentOpt.isPresent()) {
                responseObj.setStatus("success");
                responseObj.setMessage("Educational content retrieved successfully");
                responseObj.setPayload(contentOpt.get());
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Educational content not found");
                responseObj.setPayload(null);
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving educational content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Update educational content
    public ResponseObjectService updateContent(EducationalContentEntity content) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<EducationalContentEntity> existingContentOpt =
                    educationalContentRepo.findById(content.getId());

            if (existingContentOpt.isPresent()) {
                EducationalContentEntity existingContent = existingContentOpt.get();

                // Verify ownership
                if (!existingContent.getUserId().equals(content.getUserId())) {
                    responseObj.setStatus("fail");
                    responseObj.setMessage("You don't have permission to update this content");
                    responseObj.setPayload(null);
                    return responseObj;
                }

                // Update fields but preserve creation date and user lists
                if (content.getTitle() != null) {
                    existingContent.setTitle(content.getTitle());
                }
                if (content.getDescription() != null) {
                    existingContent.setDescription(content.getDescription());
                }
                if (content.getContentType() != null) {
                    existingContent.setContentType(content.getContentType());
                }
                if (content.getFileUrl() != null) {
                    existingContent.setFileUrl(content.getFileUrl());
                }
                if (content.getContent() != null) {
                    existingContent.setContent(content.getContent());
                }
                if (content.getTags() != null && !content.getTags().isEmpty()) {
                    existingContent.setTags(content.getTags());
                }

                existingContent.setUpdatedAt(Instant.now());

                EducationalContentEntity updatedContent = educationalContentRepo.save(existingContent);

                responseObj.setStatus("success");
                responseObj.setMessage("Educational content updated successfully");
                responseObj.setPayload(updatedContent);
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Educational content not found");
                responseObj.setPayload(null);
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error updating educational content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Delete educational content
    public ResponseObjectService deleteContent(EducationalContentRequest request) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<EducationalContentEntity> contentOpt =
                    educationalContentRepo.findById(request.getContentId());

            if (contentOpt.isPresent()) {
                EducationalContentEntity content = contentOpt.get();

                // Verify ownership
                if (!content.getUserId().equals(request.getUserId())) {
                    responseObj.setStatus("fail");
                    responseObj.setMessage("You don't have permission to delete this content");
                    return responseObj;
                }

                educationalContentRepo.deleteById(request.getContentId());
                responseObj.setStatus("success");
                responseObj.setMessage("Educational content deleted successfully");
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Educational content not found");
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error deleting educational content: " + e.getMessage());
        }

        return responseObj;
    }

    // Mark content as learned
    public ResponseObjectService markAsLearned(EducationalContentRequest request) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<EducationalContentEntity> contentOpt =
                    educationalContentRepo.findById(request.getContentId());

            if (contentOpt.isPresent()) {
                EducationalContentEntity content = contentOpt.get();
                List<String> learnedByList = content.getLearnedBy();

                // Add/remove user from learned list (toggle)
                if (learnedByList.contains(request.getUserId())) {
                    learnedByList.remove(request.getUserId());
                    responseObj.setMessage("Content unmarked as learned");
                } else {
                    learnedByList.add(request.getUserId());
                    responseObj.setMessage("Content marked as learned");
                }

                content.setLearnedBy(learnedByList);
                educationalContentRepo.save(content);

                responseObj.setStatus("success");
                responseObj.setPayload(content);
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Educational content not found");
                responseObj.setPayload(null);
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error marking content as learned: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Bookmark content
    public ResponseObjectService bookmarkContent(EducationalContentRequest request) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<EducationalContentEntity> contentOpt =
                    educationalContentRepo.findById(request.getContentId());

            if (contentOpt.isPresent()) {
                EducationalContentEntity content = contentOpt.get();
                List<String> bookmarkedByList = content.getBookmarkedBy();

                // Add/remove user from bookmarked list (toggle)
                if (bookmarkedByList.contains(request.getUserId())) {
                    bookmarkedByList.remove(request.getUserId());
                    responseObj.setMessage("Content unbookmarked");
                } else {
                    bookmarkedByList.add(request.getUserId());
                    responseObj.setMessage("Content bookmarked");
                }

                content.setBookmarkedBy(bookmarkedByList);
                educationalContentRepo.save(content);

                responseObj.setStatus("success");
                responseObj.setPayload(content);
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Educational content not found");
                responseObj.setPayload(null);
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error bookmarking content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Get all content marked as learned by a user
    public ResponseObjectService getLearnedContent(IdObjectEntity userId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            List<EducationalContentEntity> learnedContent =
                    educationalContentRepo.findByLearnedByContaining(userId.getId());

            responseObj.setStatus("success");
            responseObj.setMessage("Learned content retrieved successfully");
            responseObj.setPayload(learnedContent);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving learned content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Get all content bookmarked by a user
    public ResponseObjectService getBookmarkedContent(IdObjectEntity userId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            List<EducationalContentEntity> bookmarkedContent =
                    educationalContentRepo.findByBookmarkedByContaining(userId.getId());

            responseObj.setStatus("success");
            responseObj.setMessage("Bookmarked content retrieved successfully");
            responseObj.setPayload(bookmarkedContent);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving bookmarked content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Get educational content from followed users
    public ResponseObjectService getFollowingContent(IdObjectEntity userId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<UserEntity> optUser = userRepo.findById(userId.getId());
            if (optUser.isEmpty()) {
                responseObj.setStatus("fail");
                responseObj.setMessage("Cannot find user with id: " + userId.getId());
                responseObj.setPayload(null);
                return responseObj;
            }

            UserEntity user = optUser.get();
            if (user.getFollowing() == null || user.getFollowing().isEmpty()) {
                responseObj.setStatus("success");
                responseObj.setMessage("User has no followed users");
                responseObj.setPayload(new ArrayList<>());
                return responseObj;
            }

            List<String> followingIds = new ArrayList<>(user.getFollowing());
            List<EducationalContentWithUser> contentList = new ArrayList<>();

            for (String followingId : followingIds) {
                Optional<UserEntity> optFollowingUser = userRepo.findById(followingId);
                if (!optFollowingUser.isPresent()) {
                    continue;
                }

                UserEntity followingUser = optFollowingUser.get();
                followingUser.setPassword(""); // Remove password for security

                Optional<List<EducationalContentEntity>> contentListOpt =
                        educationalContentRepo.findByUserIdOrderByCreatedAtDesc(followingId);

                if (contentListOpt.isPresent()) {
                    List<EducationalContentEntity> userContent = contentListOpt.get();
                    for (EducationalContentEntity content : userContent) {
                        contentList.add(new EducationalContentWithUser(followingUser, content));
                    }
                }
            }

            // Sort by created date (newest first)
            Collections.sort(contentList, (o1, o2) ->
                    o2.getContent().getCreatedAt().compareTo(o1.getContent().getCreatedAt()));

            responseObj.setStatus("success");
            responseObj.setMessage("Following users' content retrieved successfully");
            responseObj.setPayload(contentList);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving following content: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Helper class to return content with user info
    public static class EducationalContentWithUser {
        private UserEntity user;
        private EducationalContentEntity content;

        public EducationalContentWithUser(UserEntity user, EducationalContentEntity content) {
            this.user = user;
            this.content = content;
        }

        public UserEntity getUser() {
            return user;
        }

        public void setUser(UserEntity user) {
            this.user = user;
        }

        public EducationalContentEntity getContent() {
            return content;
        }

        public void setContent(EducationalContentEntity content) {
            this.content = content;
        }
    }
}