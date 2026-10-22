package com.jetbrains.kabelo.photos.clone.api.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jetbrains.kabelo.photos.clone.api.dto.*;
import com.jetbrains.kabelo.photos.clone.api.model.Users;
import com.jetbrains.kabelo.photos.clone.api.repository.UserRepository;

@Service
public class AuthService {

        // to be injected by Spring Boot's dependency injection
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtEncoder jwtEncoder;

        public AuthService(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtEncoder jwtEncoder) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtEncoder = jwtEncoder;
        }

        public Users register(RegisterRequest request) {

                // if username already exists, throw an exception
                if (userRepository.existsByUsername(request.username())) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Username already exists");
                }

                // else, create a new user
                Users user = new Users();
                user.setUsername(request.username());
                user.setPasswordHash(
                                passwordEncoder.encode(request.password()));

                return userRepository.save(user);
        }

        public String login(LoginRequest request) {

                Users user = userRepository
                                .findByUsername(request.username())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED,
                                                "Invalid credentials"));

                // passwords dont match
                if (!passwordEncoder.matches(
                                request.password(),
                                user.getPasswordHash())) {

                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid credentials");
                }

                Instant now = Instant.now();

                // create JWT claims
                JwtClaimsSet claims = JwtClaimsSet.builder()
                                .subject(user.getId().toString())
                                .issuedAt(now)
                                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                                .claim("username", user.getUsername())
                                .build();

                JwsHeader header = JwsHeader
                                .with(MacAlgorithm.HS256)
                                .build();

                return jwtEncoder.encode(
                                JwtEncoderParameters.from(header, claims)).getTokenValue();
        }
}