package com.jetbrains.kabelo.photos.clone.api.exception;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler({
                        NoHandlerFoundException.class,
                        NoResourceFoundException.class
        })
        public ResponseEntity<Map<String, Object>> handleNotFound(
                        Exception ex,
                        HttpServletRequest request) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of(
                                                "status", 404,
                                                "message", "Route not found",
                                                "path", request.getRequestURI(),
                                                "documentation", "/api",
                                                "interfaces", Map.of(
                                                                "upload", "/upload.html",
                                                                "swagger", "/swagger-ui/index.html")));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> handleValidation(
                        MethodArgumentNotValidException ex) {

                Map<String, String> errors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .collect(Collectors.toMap(
                                                error -> error.getField(),
                                                error -> error.getDefaultMessage(),
                                                (first, second) -> first));

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(Map.of(
                                                "status", 400,
                                                "message", "Validation failed",
                                                "errors", errors));
        }

        @ExceptionHandler(MaxUploadSizeExceededException.class)
        public ResponseEntity<Map<String, Object>> handleLargeFile(
                        MaxUploadSizeExceededException ex) {

                return ResponseEntity
                                .status(HttpStatus.CONTENT_TOO_LARGE)
                                .body(Map.of(
                                                "status", 413,
                                                "error", "Content Too Large",
                                                "message", "Maximum upload size is 5 MB"));
        }

        @ExceptionHandler(ResponseStatusException.class)
        public ResponseEntity<Map<String, Object>> handleResponseStatus(
                        ResponseStatusException ex,
                        HttpServletRequest request) {

                HttpStatusCode status = ex.getStatusCode();

                // Reason may be null (e.g. `new ResponseStatusException(NOT_FOUND)` with no
                // message)
                String message = ex.getReason() != null
                                ? ex.getReason()
                                : status.toString();

                return ResponseEntity.status(status).body(Map.of(
                                "status", status.value(),
                                "error", status.toString(),
                                "message", message,
                                "path", request.getRequestURI()));
        }
}
