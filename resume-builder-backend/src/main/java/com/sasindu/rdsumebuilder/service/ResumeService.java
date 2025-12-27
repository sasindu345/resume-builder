package com.sasindu.rdsumebuilder.service;

import com.sasindu.rdsumebuilder.document.Resume;
import com.sasindu.rdsumebuilder.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Resume service for business logic operations.
 */
@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public Resume createResume(Resume resume, String userId) {
        resume.setUserId(userId);
        return resumeRepository.save(resume);
    }

    public List<Resume> getAllUserResumes(String userId) {
        return resumeRepository.findByUserId(userId);
    }

    public Resume getResumeById(String resumeId, String userId) {
        return resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new RuntimeException(
                        "Resume not found or you don't have permission to access it"));
    }

    public List<Resume> searchUserResumes(String userId, String searchTerm) {
        return resumeRepository.findByUserIdAndTitleContaining(userId, searchTerm);
    }

    public long getUserResumeCount(String userId) {
        return resumeRepository.countByUserId(userId);
    }

    public Resume updateResume(Resume resume, String userId) {
        getResumeById(resume.getId(), userId);
        resume.setUserId(userId);
        return resumeRepository.save(resume);
    }

    public Resume updateResumeTitle(String resumeId, String userId, String newTitle) {
        Resume resume = getResumeById(resumeId, userId);
        resume.setTitle(newTitle);
        return resumeRepository.save(resume);
    }

    public Resume updateResumeTemplate(String resumeId, String userId, String template) {
        Resume resume = getResumeById(resumeId, userId);
        resume.setTemplate(template);
        return resumeRepository.save(resume);
    }

    public Resume updateResumeColorTheme(String resumeId, String userId, String colorTheme) {
        Resume resume = getResumeById(resumeId, userId);
        resume.setColorTheme(colorTheme);
        return resumeRepository.save(resume);
    }

    public void deleteResume(String resumeId, String userId) {
        Resume resume = getResumeById(resumeId, userId);
        resumeRepository.delete(resume);
    }

    public void deleteAllUserResumes(String userId) {
        resumeRepository.deleteByUserId(userId);
    }

    public boolean userOwnsResume(String resumeId, String userId) {
        return resumeRepository.findByIdAndUserId(resumeId, userId).isPresent();
    }

    public boolean canCreateMoreResumes(String userId, boolean isPremium) {
        if (isPremium) {
            return true;
        }

        long resumeCount = resumeRepository.countByUserId(userId);
        return resumeCount < 3;
    }
}
