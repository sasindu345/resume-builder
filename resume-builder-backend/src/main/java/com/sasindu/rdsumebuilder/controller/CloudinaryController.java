package com.sasindu.rdsumebuilder.controller;

import com.sasindu.rdsumebuilder.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Controller for Cloudinary image upload operations.
 * All endpoints require authentication.
 */
@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    /**
     * Upload a profile image via the backend (server-side upload).
     * POST /api/cloudinary/upload
     *
     * @param file        The image file
     * @param userDetails The authenticated user
     * @return The secure URL of the uploaded image
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
        }

        String folder = "resume-builder/profiles/" + userDetails.getUsername();
        String imageUrl = cloudinaryService.uploadImage(file, folder);

        return ResponseEntity.ok(Map.of("url", imageUrl));
    }

    /**
     * Get a signed upload signature for direct browser-to-Cloudinary uploads.
     * GET /api/cloudinary/signature
     *
     * This allows the frontend to upload directly to Cloudinary without
     * proxying the file through our server.
     *
     * @param userDetails The authenticated user
     * @return Signature data needed for direct upload
     */
    @GetMapping("/signature")
    public ResponseEntity<Map<String, Object>> getUploadSignature(
            @AuthenticationPrincipal UserDetails userDetails) {

        String folder = "resume-builder/profiles/" + userDetails.getUsername();
        Map<String, Object> signatureData = cloudinaryService.generateUploadSignature(folder);

        return ResponseEntity.ok(signatureData);
    }
}
