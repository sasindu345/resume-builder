package com.sasindu.rdsumebuilder.repository;

import com.sasindu.rdsumebuilder.document.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // Marks this as a repository component
public interface ResumeRepository extends MongoRepository<Resume, String> {

    List<Resume> findByUserId(String userId);

    Optional<Resume> findByIdAndUserId(String id, String userId);

    long countByUserId(String userId);

    void deleteByUserId(String userId);

    List<Resume> findByTemplate(String template);

    List<Resume> findByUserIdAndTitleContaining(String userId, String title);

}
