package com.linhtch90.psnbackend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "saved_posts")
public class SavedPostEntity {
    @Id
    private String id;

    private String userId;      // User who saved the post
    private String postId;      // ID of the saved post
    private long savedAt;       // Timestamp when the post was saved
}