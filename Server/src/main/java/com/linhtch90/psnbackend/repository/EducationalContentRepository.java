package com.linhtch90.psnbackend.repository;

import java.util.List;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.EducationalContentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationalContentRepository extends MongoRepository<EducationalContentEntity, String> {
    Optional<List<EducationalContentEntity>> findByUserId(String userId);
    Optional<List<EducationalContentEntity>> findByUserIdOrderByCreatedAtDesc(String userId);
    List<EducationalContentEntity> findByLearnedByContaining(String userId);
    List<EducationalContentEntity> findByBookmarkedByContaining(String userId);
}