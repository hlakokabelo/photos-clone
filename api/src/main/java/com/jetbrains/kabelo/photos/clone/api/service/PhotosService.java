package com.jetbrains.kabelo.photos.clone.api.service;

import java.util.Optional;

import org.springframework.data.domain.Limit;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jetbrains.kabelo.photos.clone.api.dto.PhotoResponse;
import com.jetbrains.kabelo.photos.clone.api.model.Photo;
import com.jetbrains.kabelo.photos.clone.api.repository.PhotoRepository;

@Service
public class PhotosService {

    private final PhotoRepository photoRepository;

    public PhotosService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public Iterable<Photo> get() {
        return photoRepository.findAll();
    }

    public Iterable<PhotoResponse> search(String fileName, String contentType, Integer limit) {
        return photoRepository
                .findByContentTypeContainingIgnoreCaseAndFileNameContainingIgnoreCase(
                        contentType,
                        fileName,
                        Limit.of(Math.max(1, limit)))
                .stream()
                .map(photo -> new PhotoResponse(
                        photo.getId(),
                        photo.getFileName(),
                        photo.getContentType(),
                        "/api/photo/" + photo.getId(),
                        "/api/download/" + photo.getId()))
                .toList();
    }

    public Optional<PhotoResponse> get(Long id) {
        return photoRepository.findById(id)
                .map(photo -> new PhotoResponse(
                        photo.getId(),
                        photo.getFileName(),
                        photo.getContentType(),
                        "/api/download/" + photo.getId()));
    }

    public Photo download(Long id) {
        return photoRepository.findById(id).orElse(null);
    }

    public Photo save(String fileName, String contentType, byte[] data, Long userId) {
        Photo photo = new Photo();
        photo.setFileName(fileName);
        photo.setContentType(contentType);
        photo.setData(data);
        photo.setUserId(userId);
        photoRepository.save(photo);
        return photo;
    }

    public void deletePhoto(Long photoId, Long userId) {

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Photo not found"));

        // Only the owner can delete the photo
        if (!photo.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot delete another user's photo");
        }

        photoRepository.delete(photo);
    }
}
