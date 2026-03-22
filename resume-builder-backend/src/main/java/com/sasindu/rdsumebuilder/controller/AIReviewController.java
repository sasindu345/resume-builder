package com.sasindu.rdsumebuilder.controller;

import com.sasindu.rdsumebuilder.dto.request.AIReviewRequest;
import com.sasindu.rdsumebuilder.dto.response.AIReviewResponse;
import com.sasindu.rdsumebuilder.service.AIReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for AI-powered CV review.
 * Requires authentication — this is a premium feature.
 */
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class AIReviewController {

    private final AIReviewService aiReviewService;

    /**
     * Submit a resume for AI-powered review.
     * POST /api/resume/ai-review
     *
     * @param request     The review request with resume data and target domain
     * @param userDetails The authenticated user
     * @return Structured AI review feedback
     */
    @PostMapping("/ai-review")
    public ResponseEntity<AIReviewResponse> reviewResume(
            @RequestBody AIReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        AIReviewResponse review = aiReviewService.reviewResume(request);
        return ResponseEntity.ok(review);
    }
}
