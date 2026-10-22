package com.jetbrains.kabelo.photos.clone.api.web;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

        @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
        public ClassPathResource documentation() {
                return new ClassPathResource("api-docs.json");
        }
}