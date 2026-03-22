package com.sasindu.rdsumebuilder.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Service for uploading images to Cloudinary.
 * Used for profile picture uploads in resumes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload an image to Cloudinary.
     *
     * @param file   The image file to upload
     * @param folder The Cloudinary folder to store the image in
     * @return The secure URL of the uploaded image
     * @throws IOException if the upload fails
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        log.info("Uploading image to Cloudinary. Folder: {}, Size: {} bytes", folder, file.getSize());

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image",
                "transformation", "w_500,h_500,c_fill,g_face,q_auto,f_auto"
        ));

        String secureUrl = (String) uploadResult.get("secure_url");
        log.info("Image uploaded successfully. URL: {}", secureUrl);

        return secureUrl;
    }

    /**
     * Delete an image from Cloudinary by its public ID.
     *
     * @param publicId The Cloudinary public ID of the image
     * @throws IOException if the deletion fails
     */
    public void deleteImage(String publicId) throws IOException {
        log.info("Deleting image from Cloudinary. Public ID: {}", publicId);
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        log.info("Image deleted successfully.");
    }

    /**
     * Generate a signed upload signature for direct browser uploads.
     * This allows the frontend to upload directly to Cloudinary without
     * proxying through the backend.
     *
     * @param folder The Cloudinary folder
     * @return Map containing the signature, timestamp, api_key, and cloud_name
     */
    public Map<String, Object> generateUploadSignature(String folder) {
        long timestamp = System.currentTimeMillis() / 1000;

        @SuppressWarnings("unchecked")
        Map<String, Object> params = ObjectUtils.asMap(
                "timestamp", timestamp,
                "folder", folder
        );

        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

        return Map.of(
                "signature", signature,
                "timestamp", timestamp,
                "api_key", cloudinary.config.apiKey,
                "cloud_name", cloudinary.config.cloudName
        );
    }
}
