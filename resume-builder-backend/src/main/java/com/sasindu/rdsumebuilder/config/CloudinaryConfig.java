package com.sasindu.rdsumebuilder.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * Cloudinary configuration for image uploads.
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class CloudinaryConfig {

    private final Environment env;

    @Bean
    public Cloudinary cloudinary() {
        String cloudName = env.getProperty("CLOUDINARY_CLOUD_NAME", env.getProperty("cloudinary.cloud.name", ""));
        String apiKey = env.getProperty("CLOUDINARY_API_KEY", env.getProperty("cloudinary.api.key", ""));
        String apiSecret = env.getProperty("CLOUDINARY_API_SECRET", env.getProperty("cloudinary.api.secret", ""));

        log.info("==== CLOUDINARY CONFIG ====");
        log.info("Cloud Name : '{}'", cloudName);
        log.info("API Key    : '{}'", apiKey);
        log.info("Secret set : {}", (apiSecret != null && !apiSecret.isBlank()));
        log.info("===========================");

        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }
}

