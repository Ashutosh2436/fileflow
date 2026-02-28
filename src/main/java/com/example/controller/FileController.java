package com.example.controller;

import com.example.entity.FileAccess;
import com.example.entity.FileEntity;
import com.example.service.FileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    private final FileService service;

    public FileController(FileService service) {
        this.service = service;
    }

    // ---------------- UPLOAD FILE ----------------
    @PostMapping("/upload/{userId}")
    public FileEntity uploadFile(
            @PathVariable Long userId,
            @RequestBody FileEntity file) {

        return service.uploadFile(userId, file);
    }

    // ---------------- SHARE FILE ----------------
    @PostMapping("/share")
    public FileAccess shareFile(
            @RequestParam Long fileId,
            @RequestParam Long userId) {

        return service.shareFile(fileId, userId);
    }

    // ---------------- GET USER FILES ----------------
    @GetMapping("/user/{userId}")
    public List<FileEntity> getUserFiles(@PathVariable Long userId) {
        return service.getUserFiles(userId);
    }
    // ---------------- DELETE FILE ----------------
    @DeleteMapping("/delete/{fileId}")
    public String deleteFile(@PathVariable Long fileId) {

        service.deleteFile(fileId);
        return "File deleted successfully";
    }
    // ---------------- REVOKE ACCESS ----------------
    @DeleteMapping("/revoke")
    public String revokeAccess(@RequestParam Long fileId,
                               @RequestParam Long userId) {

        service.revokeAccess(fileId, userId);
        return "Access revoked successfully";
    }

    @GetMapping("/test")
    public String test() {
        return "Controller is working";
    }
    @GetMapping
    public String home() {
        return "Files API is running";
    }
    // ---------------- GALLERY ----------------
    @GetMapping("/gallery/{userId}")
    public List<FileEntity> getGallery(@PathVariable Long userId) {
        return service.getGallery(userId);
    }
}