package com.jetbrains.kabelo.photos.clone.api.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

        @Bean
        public UrlBasedCorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(List.of(
                                "http://localhost:5173",
                                "http://127.0.0.1:5173",
                                "https://photos-clone-gui.vercel.app"));

                config.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "PATCH",
                                "DELETE", "OPTIONS"));

                config.setAllowedHeaders(List.of(
                                "Authorization",
                                "Content-Type",
                                "Accept",
                                "Origin"));

                // Allow JavaScript to read the original download filename.
                configuration.setExposedHeaders(
                                List.of("Content-Disposition"));

                // GUI uses Bearer tokens, not cookie-based authentication.
                config.setAllowCredentials(false);
                config.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);

                return source;
        }
}