package com.jetbrains.kabelo.photos.clone.api.web;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.jetbrains.kabelo.photos.clone.api.model.Photo;
import com.jetbrains.kabelo.photos.clone.api.service.PhotosService;

@RestController
@RequestMapping("/api")
public class DownloadController {
    private final PhotosService photosService;

    DownloadController(PhotosService photosService) {
        this.photosService = photosService;
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {

        Photo photo = photosService.download(id);

        if (photo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        // Set the content type
        MediaType contentType = MediaType.parseMediaType(photo.getContentType());

        ContentDisposition contentDisposition = ContentDisposition.attachment().filename(photo.getFileName()).build();

        /**
         * to display in browser use
         * ContentDisposition.inline().filename(photo.getFileName()).build();
         */

        // Get the photo data
        byte[] data = photo.getData();

        // Build and return the HTTP response
        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .body(data);
    }

}
