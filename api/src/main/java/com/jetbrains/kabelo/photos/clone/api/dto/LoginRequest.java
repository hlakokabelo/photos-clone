package com.jetbrains.kabelo.photos.clone.api.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
                @NotBlank String username,
                @NotBlank String password) {
}