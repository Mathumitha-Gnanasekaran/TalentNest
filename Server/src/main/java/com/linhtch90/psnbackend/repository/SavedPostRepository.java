package com.linhtch90.psnbackend.repository;

import java.util.List;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.SavedPostEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedPostRepository extends MongoRepository<SavedPostEntity, String> {
    List<SavedPostEntity> findByUserId(String userId);
    Optional<SavedPostEntity> findByUserIdAndPostId(String userId, String postId);
    void deleteByUserIdAndPostId(String userId, String postId);
    boolean existsByUserIdAndPostId(String userId, String postId);
}