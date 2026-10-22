package com.jetbrains.kabelo.photos.clone.api.config;

import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

        // Registers PasswordEncoder as a Spring-managed bean for dependency injection
        @Bean
        PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        SecretKey jwtKey(
                        // (value) fetches from applications.properties
                        @Value("${app.jwt.secret}") String secret) {

                byte[] bytes = Base64.getDecoder().decode(secret);

                if (bytes.length < 32) {
                        throw new IllegalArgumentException(
                                        "JWT secret must be at least 32 bytes");
                }

                return new SecretKeySpec(bytes, "HmacSHA256");
        }

        @Bean
        JwtEncoder jwtEncoder(SecretKey key) {
                return new NimbusJwtEncoder(
                                new ImmutableSecret<>(key));
        }

        @Bean
        JwtDecoder jwtDecoder(SecretKey key) {
                return NimbusJwtDecoder
                                .withSecretKey(key)
                                .macAlgorithm(MacAlgorithm.HS256)
                                .build();
        }

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                return http // Enable CORS using CorsConfigurationSource
                                .cors(Customizer.withDefaults())
                                // Disable CSRF protection since we're using JWTs
                                // sent through Authorization headers instead of cookies
                                .csrf(csrf -> csrf.disable())

                                // Stateless: Spring won't store user authentication in sessions.
                                // Every protected request must provide a valid JWT.
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                // Define which endpoints require authentication
                                .authorizeHttpRequests(auth -> auth

                                                // Allow anyone to register or log in
                                                .requestMatchers("/api/auth/**").permitAll()

                                                // Only authenticated users can upload photos
                                                .requestMatchers(
                                                                HttpMethod.POST, "/api/photo")
                                                .authenticated()

                                                // Only authenticated users can delete photos
                                                .requestMatchers(HttpMethod.DELETE, "/api/photo/*")
                                                .authenticated()

                                                // Allow public access to all remaining endpoints
                                                .anyRequest().permitAll())

                                // Enable JWT authentication.
                                // Spring extracts and validates Bearer tokens from requests.
                                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))

                                // Build the configured security filter chain
                                .build();
        }
}