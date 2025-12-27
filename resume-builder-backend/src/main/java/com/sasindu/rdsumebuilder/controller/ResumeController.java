package com.sasindu.rdsumebuilder.controller;

import com.sasindu.rdsumebuilder.document.Resume;
import com.sasindu.rdsumebuilder.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<Resume> createResume(
            @RequestBody Resume resume,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Extract email from authenticated user
        String email = userDetails.getUsername();

        // Get user ID from email (we'll use email as userId for now)
        // In production, you'd fetch the actual User object to get the ID
        String userId = email;

        // Create resume via service
        Resume createdResume = resumeService.createResume(resume, userId);

        // Return 201 Created with resume data
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResume);
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getAllResumes(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<Resume> resumes = resumeService.getAllUserResumes(userId);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Resume resume = resumeService.getResumeById(id, userId);
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(
            @PathVariable String id,
            @RequestBody Resume resume,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();

        // Set ID to ensure we're updating the correct resume
        resume.setId(id);

        Resume updatedResume = resumeService.updateResume(resume, userId);
        return ResponseEntity.ok(updatedResume);
    }

    @PatchMapping("/{id}/title")
    public ResponseEntity<Resume> updateResumeTitle(
            @PathVariable String id,
            @RequestParam String title,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Resume updatedResume = resumeService.updateResumeTitle(id, userId, title);
        return ResponseEntity.ok(updatedResume);
    }

    @PatchMapping("/{id}/template")
    public ResponseEntity<Resume> updateResumeTemplate(
            @PathVariable String id,
            @RequestParam String template,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Resume updatedResume = resumeService.updateResumeTemplate(id, userId, template);
        return ResponseEntity.ok(updatedResume);
    }

    @PatchMapping("/{id}/theme")
    public ResponseEntity<Resume> updateResumeTheme(
            @PathVariable String id,
            @RequestParam String theme,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Resume updatedResume = resumeService.updateResumeColorTheme(id, userId, theme);
        return ResponseEntity.ok(updatedResume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        resumeService.deleteResume(id, userId);
        return ResponseEntity.ok("Resume deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Resume>> searchResumes(
            @RequestParam("q") String query,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<Resume> results = resumeService.searchUserResumes(userId, query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/count")
    public ResponseEntity<?> getResumeCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        long count = resumeService.getUserResumeCount(userId);

        var response = new java.util.HashMap<String, Object>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }
}
