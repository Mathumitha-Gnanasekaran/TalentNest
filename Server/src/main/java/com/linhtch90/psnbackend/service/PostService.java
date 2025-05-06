package com.linhtch90.psnbackend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.*;
import com.linhtch90.psnbackend.repository.PostRepository;
import com.linhtch90.psnbackend.repository.ProgressRepository;
import com.linhtch90.psnbackend.repository.SavedPostRepository;
import com.linhtch90.psnbackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepo;
    @Autowired
    private UserRepository userRepo;
    public ResponseObjectService findAll() {
        ResponseObjectService responseObj = new ResponseObjectService();
        responseObj.setPayload(postRepo.findAll());
        responseObj.setStatus("success");
        responseObj.setMessage("success");
        return responseObj;
    }
    public ResponseObjectService insertPost(PostEntity inputPost) {
        ResponseObjectService responseObj = new ResponseObjectService();
        inputPost.setCreatedAt(Instant.now());
        responseObj.setStatus("success");
        responseObj.setMessage("success");
        responseObj.setPayload(postRepo.save(inputPost));
        return responseObj;
    }
    public ResponseObjectService deleteUserPost(IdObjectEntity id) {
        ResponseObjectService responseObj = new ResponseObjectService();
        try {
            System.out.println("deleteUserPost " + id.getId());

            // Check if post exists before deleting
            Optional<PostEntity> optPost = postRepo.findById(id.getId());
            if (optPost.isPresent()) {
                postRepo.deleteById(id.getId());
                responseObj.setStatus("success");
                responseObj.setMessage("Post deleted successfully");
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Cannot find post with id: " + id.getId());
            }
        } catch (Exception e) {
            System.err.println("Error deleting post: " + e.getMessage());
            e.printStackTrace();
            responseObj.setStatus("fail");
            responseObj.setMessage("Failed to delete post: " + e.getMessage());
        }
        return responseObj;
    }
    public ResponseObjectService editUserPost(PostEntity inputPost) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            // Find the existing post first
            Optional<PostEntity> existingPostOpt = postRepo.findById(inputPost.getId());

            if (existingPostOpt.isPresent()) {
                PostEntity existingPost = existingPostOpt.get();

                // Update only the fields that were provided in the input
                if (inputPost.getContent() != null) {
                    existingPost.setContent(inputPost.getContent());
                }
//                if (inputPost.getLongDesc() != null) {
//                    existingPost.setLongDesc(inputPost.getLongDesc());
//                }
                if (inputPost.getImages() != null) {
                    existingPost.setImages(inputPost.getImages());
                }

                // Keep the original creation time but update the post
                // Don't need to set a new creation time unless you want to

                // Save the updated post
                PostEntity savedPost = postRepo.save(existingPost);

                responseObj.setStatus("success");
                responseObj.setMessage("Post updated successfully");
                responseObj.setPayload(savedPost);
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Cannot find post with id: " + inputPost.getId());
                responseObj.setPayload(null);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            responseObj.setStatus("fail");
            responseObj.setMessage("Error updating post: " + ex.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }
    public ResponseObjectService deletePost(IdObjectEntity inputUserId,IdObjectEntity IdPostId) {
        ResponseObjectService responseObj = new ResponseObjectService();
//        inputPost.setCreatedAt(Instant.now());
        System.out.println(inputUserId);
        System.out.println(IdPostId);
//        Optional<UserEntity> optUser = userRepo.findById(IdObjectEntity IdPostId);
        responseObj.setStatus("success");
        responseObj.setMessage("success");
        postRepo.deleteById(String.valueOf(IdPostId));
//        responseObj.setPayload(postRepo.deleteById(IdObjectEntity IdPostId));
        return responseObj;
    }

    public ResponseObjectService findPostByUserId(IdObjectEntity inputUserId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<List<PostEntity>> userPostsOpt = postRepo.findByUserIdOrderByCreatedAtDesc(inputUserId.getId());
        if (userPostsOpt.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find any post from user id: " + inputUserId.getId());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            List<PostEntity> userPosts = userPostsOpt.get();
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            responseObj.setPayload(userPosts);
            return responseObj;
        }
    }
    
    public ResponseObjectService findPostByFollowing(IdObjectEntity inputUserId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<UserEntity> optUser = userRepo.findById(inputUserId.getId());
        if (optUser.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find any post from user id: " + inputUserId.getId());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            UserEntity user = optUser.get();
            if (user.getFollowing() != null) {
                // if user followed someone, get their ids
                List<String> followingIds = new ArrayList<>();
                for (String id : user.getFollowing()) {
                    followingIds.add(id);
                }
                // based on these ids, get their equivalent posts
                List<PostByFollowing> listPosts = new ArrayList<>();
                for (String followingId : followingIds) {
                    // get following user info based on Id
                    UserEntity followingUser = new UserEntity();
                    Optional<UserEntity> optFollowingUser = userRepo.findById(followingId);
                    if (optFollowingUser.isPresent()) {
                        followingUser = optFollowingUser.get();
                    }

                    followingUser.setPassword("");
                    
                    // get equivalent posts
                    Optional<List<PostEntity>> followingPostsOpt = postRepo.findByUserId(followingId);
                    if (followingPostsOpt.isPresent()) {
                        // if followed account has any post, collect them
                        List<PostEntity> followingPosts = followingPostsOpt.get();
                        if (followingPosts != null) {
                            for (PostEntity item : followingPosts) {
                                listPosts.add(new PostByFollowing(followingUser, item));
                            }
                        }
                    }
                }
                Collections.sort(listPosts, (o1, o2) -> o2.getPost().getCreatedAt().compareTo(o1.getPost().getCreatedAt()));
                responseObj.setStatus("success");
                responseObj.setMessage("success");
                responseObj.setPayload(listPosts);
                return responseObj;
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("user id: " + inputUserId.getId() + " has empty following list");
                responseObj.setPayload(null);
                return responseObj;
            }
        }
    }

    public ResponseObjectService updatePostByComment(PostEntity inputPost) {
        System.out.println(inputPost);
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(inputPost.getId());
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find post id: " + inputPost.getId());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            // inputPost.setCreatedAt(Instant.now());
            postRepo.save(inputPost);
            responseObj.setStatus("success");
            responseObj.setMessage("post is updated successfully");
            responseObj.setPayload(inputPost);
            return responseObj;
        }
    }

    public ResponseObjectService updateEditPostByComment(PostEntity inputPost) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(inputPost.getId());
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find post id: " + inputPost.getId());
            responseObj.setPayload(null);
            return responseObj;
        } else {
             inputPost.setCreatedAt(Instant.now());
            postRepo.save(inputPost);
            responseObj.setStatus("success");
            responseObj.setMessage("post is updated successfully");
            responseObj.setPayload(inputPost);
            return responseObj;
        }
    }

    public ResponseObjectService updatePostByLove(DoubleIdObjectEntity doubleId) {
        // id 1 - post Id, id 2 - user who liked post
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(doubleId.getId1());
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find post id: " + doubleId.getId1());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            PostEntity targetPost = optPost.get();
            List<String> loveList = targetPost.getLove();
            if (loveList == null) {
                loveList = new ArrayList<>();
            }
            // love and unlove a post
            if (!loveList.contains(doubleId.getId2())) {
                loveList.add(doubleId.getId2());
            } else {
                loveList.remove(doubleId.getId2());
            }
            targetPost.setLove(loveList);
            postRepo.save(targetPost);
            responseObj.setStatus("success");
            responseObj.setMessage("update love to the target post id: " + targetPost.getId());
            responseObj.setPayload(targetPost);
            return responseObj;
        }
    }

    public ResponseObjectService updatePostByShare(DoubleIdObjectEntity doubleId) {
        // id 1 - post Id, id 2 - user who shared post
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(doubleId.getId1());
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find post id: " + doubleId.getId1());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            PostEntity targetPost = optPost.get();
            List<String> shareList = targetPost.getShare();
            if (shareList == null) {
                shareList = new ArrayList<>();
            }
            // save id of user who shared the post then update post
            shareList.add(doubleId.getId2());
            targetPost.setShare(shareList);
            postRepo.save(targetPost);
            // update post list of user who shared the post
            targetPost.setUserId(doubleId.getId2());
            targetPost.setId(null);
            targetPost.setContent("Shared a post: " + targetPost.getContent());
            targetPost.setLove(new ArrayList<>());
            targetPost.setShare(new ArrayList<>());
            targetPost.setComment(new ArrayList<>());
            postRepo.save(targetPost);

            responseObj.setStatus("success");
            responseObj.setMessage("add a share to the target post id: " + targetPost.getId());
            responseObj.setPayload(targetPost);
            return responseObj;
        }
    }
    @Autowired
    private SavedPostRepository savedPostRepo;

    // Save a post for a user
    public ResponseObjectService savePost(SavePostRequest request) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            String userId = request.getUserId();
            String postId = request.getPostId();

            // Check if the post exists
            Optional<PostEntity> optPost = postRepo.findById(postId);
            if (optPost.isEmpty()) {
                responseObj.setStatus("fail");
                responseObj.setMessage("Cannot find post with id: " + postId);
                return responseObj;
            }

            // Check if already saved
            if (savedPostRepo.existsByUserIdAndPostId(userId, postId)) {
                responseObj.setStatus("fail");
                responseObj.setMessage("Post already saved by this user");
                return responseObj;
            }

            // Create saved post entry
            SavedPostEntity savedPost = new SavedPostEntity();
            savedPost.setUserId(userId);
            savedPost.setPostId(postId);
            savedPost.setSavedAt(System.currentTimeMillis());
            savedPostRepo.save(savedPost);

            // Update the post's savedBy list
            PostEntity post = optPost.get();
            List<String> savedByList = post.getSavedBy();
            if (savedByList == null) {
                savedByList = new ArrayList<>();
            }
            savedByList.add(userId);
            post.setSavedBy(savedByList);
            postRepo.save(post);

            responseObj.setStatus("success");
            responseObj.setMessage("Post saved successfully");
            responseObj.setPayload(savedPost);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error saving post: " + e.getMessage());
        }

        return responseObj;
    }

    // Unsave a post
    public ResponseObjectService unsavePost(SavePostRequest request) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            String userId = request.getUserId();
            String postId = request.getPostId();

            // Check if the saved relationship exists
            Optional<SavedPostEntity> savedPostOpt = savedPostRepo.findByUserIdAndPostId(userId, postId);
            if (savedPostOpt.isEmpty()) {
                responseObj.setStatus("fail");
                responseObj.setMessage("Post not saved by this user");
                return responseObj;
            }

            // Delete the saved entry
            savedPostRepo.delete(savedPostOpt.get());

            // Update the post's savedBy list
            Optional<PostEntity> optPost = postRepo.findById(postId);
            if (optPost.isPresent()) {
                PostEntity post = optPost.get();
                List<String> savedByList = post.getSavedBy();
                if (savedByList != null) {
                    savedByList.remove(userId);
                    post.setSavedBy(savedByList);
                    postRepo.save(post);
                }
            }

            responseObj.setStatus("success");
            responseObj.setMessage("Post unsaved successfully");
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error unsaving post: " + e.getMessage());
        }

        return responseObj;
    }

    // Get all saved posts for a user
    public ResponseObjectService getSavedPosts(IdObjectEntity userIdObj) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            String userId = userIdObj.getId();

            // Get all saved post entries for this user
            List<SavedPostEntity> savedPosts = savedPostRepo.findByUserId(userId);

            if (savedPosts.isEmpty()) {
                responseObj.setStatus("success");
                responseObj.setMessage("No saved posts found");
                responseObj.setPayload(new ArrayList<>());
                return responseObj;
            }

            // Get the actual post details for each saved post
            List<PostEntity> postList = new ArrayList<>();
            for (SavedPostEntity savedPost : savedPosts) {
                Optional<PostEntity> post = postRepo.findById(savedPost.getPostId());
                post.ifPresent(postList::add);
            }

            responseObj.setStatus("success");
            responseObj.setMessage("Retrieved " + postList.size() + " saved posts");
            responseObj.setPayload(postList);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving saved posts: " + e.getMessage());
        }

        return responseObj;
    }

    // Check if a post is saved by a user
    public ResponseObjectService isPostSaved(SavePostRequest request) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            boolean isSaved = savedPostRepo.existsByUserIdAndPostId(
                    request.getUserId(),
                    request.getPostId()
            );

            responseObj.setStatus("success");
            responseObj.setMessage("Post saved status retrieved");
            responseObj.setPayload(isSaved);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error checking saved status: " + e.getMessage());
        }

        return responseObj;
    }

    // Add these methods to the existing PostService class

    @Autowired
    private ProgressRepository progressRepo;

    // Create a new progress entry
    public ResponseObjectService createProgress(ProgressEntity progress) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Instant now = Instant.now();
            progress.setCreatedAt(now);
            progress.setUpdatedAt(now);

            ProgressEntity savedProgress = progressRepo.save(progress);

            responseObj.setStatus("success");
            responseObj.setMessage("Progress created successfully");
            responseObj.setPayload(savedProgress);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error creating progress: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Get all progress entries for a user
    public ResponseObjectService getUserProgress(IdObjectEntity userId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            List<ProgressEntity> progressList = progressRepo.findByUserIdOrderByUpdatedAtDesc(userId.getId());

            responseObj.setStatus("success");
            responseObj.setMessage("User progress retrieved successfully");
            responseObj.setPayload(progressList);
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving progress: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Get a specific progress entry
    public ResponseObjectService getProgressById(DoubleIdObjectEntity ids) {
        // ids.getId1() = progressId, ids.getId2() = userId
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<ProgressEntity> progressOpt = progressRepo.findByIdAndUserId(ids.getId1(), ids.getId2());

            if (progressOpt.isPresent()) {
                responseObj.setStatus("success");
                responseObj.setMessage("Progress retrieved successfully");
                responseObj.setPayload(progressOpt.get());
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Progress not found or not owned by user");
                responseObj.setPayload(null);
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving progress: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Update a progress entry
    public ResponseObjectService updateProgress(ProgressEntity progress) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<ProgressEntity> existingProgressOpt = progressRepo.findByIdAndUserId(progress.getId(), progress.getUserId());

            if (existingProgressOpt.isPresent()) {
                ProgressEntity existingProgress = existingProgressOpt.get();

                // Update fields but preserve creation date
                if (progress.getTitle() != null) {
                    existingProgress.setTitle(progress.getTitle());
                }
                if (progress.getDescription() != null) {
                    existingProgress.setDescription(progress.getDescription());
                }
                if (progress.getCurrentValue() != null) {
                    existingProgress.setCurrentValue(progress.getCurrentValue());
                }
                if (progress.getTargetValue() != null) {
                    existingProgress.setTargetValue(progress.getTargetValue());
                }
                if (progress.getUnit() != null) {
                    existingProgress.setUnit(progress.getUnit());
                }
                if (progress.getCategory() != null) {
                    existingProgress.setCategory(progress.getCategory());
                }

                existingProgress.setUpdatedAt(Instant.now());

                ProgressEntity updatedProgress = progressRepo.save(existingProgress);

                responseObj.setStatus("success");
                responseObj.setMessage("Progress updated successfully");
                responseObj.setPayload(updatedProgress);
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Progress not found or not owned by user");
                responseObj.setPayload(null);
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error updating progress: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }

    // Delete a progress entry
    public ResponseObjectService deleteProgress(DoubleIdObjectEntity ids) {
        // ids.getId1() = progressId, ids.getId2() = userId
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<ProgressEntity> progressOpt = progressRepo.findByIdAndUserId(ids.getId1(), ids.getId2());

            if (progressOpt.isPresent()) {
                progressRepo.deleteById(ids.getId1());
                responseObj.setStatus("success");
                responseObj.setMessage("Progress deleted successfully");
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("Progress not found or not owned by user");
            }
        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error deleting progress: " + e.getMessage());
        }

        return responseObj;
    }

    public ResponseObjectService getFollowingProgress(IdObjectEntity inputUserId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        try {
            Optional<UserEntity> optUser = userRepo.findById(inputUserId.getId());
            if (optUser.isEmpty()) {
                responseObj.setStatus("fail");
                responseObj.setMessage("Cannot find user with id: " + inputUserId.getId());
                responseObj.setPayload(null);
                return responseObj;
            }

            UserEntity user = optUser.get();
            if (user.getFollowing() == null || user.getFollowing().isEmpty()) {
                responseObj.setStatus("fail");
                responseObj.setMessage("User id: " + inputUserId.getId() + " has empty following list");
                responseObj.setPayload(null);
                return responseObj;
            }

            // Get IDs of all users the current user follows
            List<String> followingIds = new ArrayList<>(user.getFollowing());

            // Create a list to hold all progress entries from followed users
            List<ProgressByFollowing> progressList = new ArrayList<>();

            // Fetch progress entries for each followed user
            for (String followingId : followingIds) {
                // Get following user info based on Id
                Optional<UserEntity> optFollowingUser = userRepo.findById(followingId);
                if (!optFollowingUser.isPresent()) {
                    continue; // Skip if user not found
                }

                UserEntity followingUser = optFollowingUser.get();
                followingUser.setPassword(""); // Remove password for security

                // Get all progress entries for this followed user
                List<ProgressEntity> userProgress = progressRepo.findByUserIdOrderByUpdatedAtDesc(followingId);

                // Add each progress entry with associated user info
                for (ProgressEntity progress : userProgress) {
                    progressList.add(new ProgressByFollowing(followingUser, progress));
                }
            }

            // Sort the list by updatedAt in descending order (newest first)
            Collections.sort(progressList, (o1, o2) ->
                    o2.getProgress().getUpdatedAt().compareTo(o1.getProgress().getUpdatedAt()));

            responseObj.setStatus("success");
            responseObj.setMessage("Successfully retrieved progress from following users");
            responseObj.setPayload(progressList);

        } catch (Exception e) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Error retrieving following progress: " + e.getMessage());
            responseObj.setPayload(null);
        }

        return responseObj;
    }
}
