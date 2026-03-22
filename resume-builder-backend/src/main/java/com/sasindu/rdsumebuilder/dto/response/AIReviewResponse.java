package com.sasindu.rdsumebuilder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response from the AI CV Review containing structured feedback.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIReviewResponse {

    /**
     * Overall score out of 10
     */
    private int overallScore;

    /**
     * Brief summary of the review
     */
    private String summary;

    /**
     * Critical issues found in the resume
     */
    private List<ReviewItem> criticalIssues;

    /**
     * Suggested improvements
     */
    private List<ReviewItem> improvements;

    /**
     * Strengths of the resume
     */
    private List<ReviewItem> strengths;

    /**
     * Structural suggestions (formatting, ordering, etc.)
     */
    private List<ReviewItem> structuralSuggestions;

    /**
     * Keywords missing for the target domain
     */
    private List<String> missingKeywords;

    /**
     * ATS (Applicant Tracking System) compatibility tips
     */
    private List<String> atsTips;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReviewItem {
        private String title;
        private String description;
        private String priority; // HIGH, MEDIUM, LOW
    }
}
