package com.example.repository;

import com.example.entity.FileAccess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileAccessRepository extends JpaRepository<FileAccess, Long> {

    // For duplicate check
    Optional<FileAccess> findByFile_FileIdAndUser_UserId(Long fileId, Long userId);

    // For revoke (return number of rows deleted)
    long deleteByFile_FileIdAndUser_UserId(Long fileId, Long userId);

    // For delete file optimization (return number of rows deleted)
    long deleteByFile_FileId(Long fileId);

    // For gallery (files shared with user)
    List<FileAccess> findByUser_UserId(Long userId);
}