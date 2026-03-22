package com.sasindu.rdsumebuilder.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request body for AI CV review.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIReviewRequest {

    /**
     * The target domain/industry for the resume review.
     * Examples: "Software Engineering", "Marketing", "Finance", "Data Science"
     */
    private String targetDomain;

    /**
     * The full resume content as a JSON string or structured text.
     * This will be sent to the AI for analysis.
     */
    private Object resumeData;
}
