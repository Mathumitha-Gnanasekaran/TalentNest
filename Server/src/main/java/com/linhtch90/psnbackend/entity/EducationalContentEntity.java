package com.linhtch90.psnbackend.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "educational_content")
public class EducationalContentEntity {
    @Id
    private String id;

    private String userId;

    private String title;

    private String description;

    private String contentType; // "PDF" or "TEXT"

    private String fileUrl; // URL to PDF file if contentType is "PDF"

    private String content; // Text content if contentType is "TEXT"

    private List<String> tags = new ArrayList<>();

    private Instant createdAt;

    private Instant updatedAt;

    private List<String> learnedBy = new ArrayList<>(); // List of user IDs who marked this as learned

    private List<String> bookmarkedBy = new ArrayList<>(); // List of user IDs who bookmarked this
}