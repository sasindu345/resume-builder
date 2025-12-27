package com.sasindu.rdsumebuilder.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Resume entity representing a user's resume document.
 * Stored in MongoDB "resumes" collection.
 * One User → Many Resumes relationship.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "resumes")
public class Resume {

    @Id
    private String id;

    /**
     * ID of the user who owns this resume
     */
    private String userId;

    // ========================================================================
    // RESUME METADATA
    // ========================================================================

    /**
     * Resume title/name
     */
    private String title;

    /**
     * Selected template name (modern, classic, minimal, professional, creative)
     */
    @Builder.Default
    private String template = "modern";

    /**
     * Color theme for the resume
     */
    @Builder.Default
    private String colorTheme = "blue";

    /**
     * JSON string containing all resume data
     * Used for flexible storage of editor content
     */
    private String content;

    /**
     * Personal information section
     */
    private PersonalInfo personalInfo;

    /**
     * Professional summary/objective
     */
    private String summary;

    /**
     * Education entries
     */
    private List<Education> education;

    /**
     * Work experience entries
     */
    private List<Experience> experience;

    /**
     * List of skills
     */
    private List<Skill> skills;

    /**
     * List of projects
     */
    private List<Project> projects;

    /**
     * List of certifications
     * Example: AWS Certified, Google Cloud Professional
     */
    private List<Certification> certifications;

    /**
     * List of languages known
     * Example: English (Native), Spanish (Fluent)
     */
    private List<Language> languages;

    // ========================================================================
    // TIMESTAMPS
    // ========================================================================

    /**
     * When resume was created
     */
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * When resume was last modified
     */
    @LastModifiedDate
    private LocalDateTime updatedAt;

    /**
     * Personal Information Section
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonalInfo {
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String website;
        private String linkedIn;
        private String github;
        private String portfolio;
        private String profileImage;
    }

    /**
     * Education Entry
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Education {
        private String degree;
        private String fieldOfStudy;
        private String institution;
        private String location;
        private String startDate;
        private String endDate;
        private String grade;
        private String description;
    }

    /**
     * Work Experience Entry
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Experience {
        private String jobTitle;
        private String company;
        private String location;
        private String startDate;
        private String endDate;
        private Boolean isCurrentJob;
        private String description;
        private List<String> achievements;
    }

    /**
     * Skill Entry
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Skill {
        private String name;
        private String category;
        private String level;
    }

    /**
     * Project Entry
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Project {
        private String name;
        private String description;
        private String startDate;
        private String endDate;
        private String url;
        private List<String> technologies;
        private List<String> highlights;
    }

    /**
     * Certification Entry
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Certification {
        private String name;
        private String issuer;
        private String issueDate;
        private String expiryDate;
        private String credentialId;
        private String credentialUrl;
    }

    /**
     * Language Entry
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Language {
        private String name;
        private String proficiency;
    }
}
