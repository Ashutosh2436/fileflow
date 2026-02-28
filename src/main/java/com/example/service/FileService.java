package com.example.service;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.ArrayList;
import com.example.entity.FileAccess;
import com.example.entity.FileEntity;
import com.example.entity.User;
import com.example.repository.FileAccessRepository;
import com.example.repository.FileRepository;
import com.example.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final FileAccessRepository fileAccessRepository;

    public FileService(FileRepository fileRepository,
                       UserRepository userRepository,
                       FileAccessRepository fileAccessRepository) {

        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.fileAccessRepository = fileAccessRepository;
    }

    // ----------------- UPLOAD FILE -----------------
    public FileEntity uploadFile(Long userId, FileEntity file) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        file.setUser(user);

        return fileRepository.save(file);
    }

    // ----------------- SHARE FILE -----------------
    public FileAccess shareFile(Long fileId, Long userId) {

        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent owner sharing to himself
        if (file.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Owner already has access to the file");
        }

        // Prevent duplicate sharing
        if (fileAccessRepository
                .findByFile_FileIdAndUser_UserId(fileId, userId)
                .isPresent()) {

            throw new RuntimeException("File already shared with this user");
        }

        FileAccess access = new FileAccess();
        access.setFile(file);
        access.setUser(user);

        return fileAccessRepository.save(access);
    }

    // ----------------- GET USER FILES -----------------
    public List<FileEntity> getUserFiles(Long userId) {
        return fileRepository.findByUser_UserId(userId);
    }

    // ----------------- DELETE FILE -----------------
    @Transactional
    public void deleteFile(Long fileId) {

        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // delete child records first
        fileAccessRepository.deleteByFile_FileId(fileId);

        // then delete file
        fileRepository.delete(file);
    }

    // ----------------- REVOKE ACCESS -----------------
    @Transactional
    public void revokeAccess(Long fileId, Long userId) {

        long deletedCount =
                fileAccessRepository
                        .deleteByFile_FileIdAndUser_UserId(fileId, userId);

        if (deletedCount == 0) {
            throw new RuntimeException("Access not found");
        }
    }

    public List<FileEntity> getGallery(Long userId) {

        List<FileEntity> ownFiles = fileRepository.findByUser_UserId(userId);

        List<FileAccess> accesses = fileAccessRepository.findByUser_UserId(userId);

        List<FileEntity> sharedFiles = accesses.stream()
                .map(FileAccess::getFile)
                .toList();

        // Use Set to avoid duplicates
        Set<FileEntity> allFiles = new LinkedHashSet<>();

        allFiles.addAll(ownFiles);
        allFiles.addAll(sharedFiles);

        return new ArrayList<>(allFiles);
    }
}