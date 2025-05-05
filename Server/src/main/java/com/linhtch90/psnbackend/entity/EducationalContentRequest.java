package com.linhtch90.psnbackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EducationalContentRequest {
    private String contentId;
    private String userId;
}