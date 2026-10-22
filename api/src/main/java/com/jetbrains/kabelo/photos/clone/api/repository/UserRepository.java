package com.jetbrains.kabelo.photos.clone.api.repository;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import com.jetbrains.kabelo.photos.clone.api.model.Users;

public interface UserRepository
        extends CrudRepository<Users, Long> {

    Optional<Users> findByUsername(String username);

    boolean existsByUsername(String username);
}