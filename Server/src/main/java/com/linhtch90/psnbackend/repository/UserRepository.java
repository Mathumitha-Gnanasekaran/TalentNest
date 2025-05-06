package com.linhtch90.psnbackend.repository;

import java.util.Optional;

import com.linhtch90.psnbackend.entity.UserEntity;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {

    Optional<UserEntity> findByEmail(String email);
    @Query("{ '_id' : ?0 }")
    void updateBio(String id, String bio);

}
