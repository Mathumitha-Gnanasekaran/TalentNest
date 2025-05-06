package com.linhtch90.psnbackend.repository;

import java.util.List;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.ProgressEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressRepository extends MongoRepository<ProgressEntity, String> {
    List<ProgressEntity> findByUserId(String userId);
    List<ProgressEntity> findByUserIdOrderByUpdatedAtDesc(String userId);
    Optional<ProgressEntity> findByIdAndUserId(String id, String userId);
}