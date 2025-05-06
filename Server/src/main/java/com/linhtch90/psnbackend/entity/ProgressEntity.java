package com.linhtch90.psnbackend.entity;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "progress")
public class ProgressEntity {
    @Id
    private String id;

    private String userId;

    private String title;

    private String description;

    private Double initialValue;

    private Double currentValue;

    private Double targetValue;

    private String unit;

    private String category;

    private Instant createdAt;

    private Instant updatedAt;
}