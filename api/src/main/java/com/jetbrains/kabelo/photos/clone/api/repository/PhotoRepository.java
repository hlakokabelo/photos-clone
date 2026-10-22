package com.jetbrains.kabelo.photos.clone.api.repository;

import java.util.List;

import org.springframework.data.domain.Limit;
import org.springframework.data.repository.CrudRepository;

import com.jetbrains.kabelo.photos.clone.api.model.Photo;

public interface PhotoRepository extends CrudRepository<Photo, Long> {
    List<Photo> findByContentTypeContainingIgnoreCaseAndFileNameContainingIgnoreCase(String contentType,
            String fileName, Limit limit);

}