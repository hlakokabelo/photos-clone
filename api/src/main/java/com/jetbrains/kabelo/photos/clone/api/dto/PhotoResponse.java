package com.jetbrains.kabelo.photos.clone.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PhotoResponse(
        Long id,
        String fileName,
        String contentType,
        String photoUrl,
        String downloadUrl) {
    public PhotoResponse(
            Long id,
            String fileName,
            String contentType,
            String downloadUrl) {
        this(id, fileName, contentType, null, downloadUrl);
    }
}