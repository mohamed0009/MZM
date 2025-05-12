package com.mzm.pharmaflow.repository;

import com.mzm.pharmaflow.model.ERole;
import com.mzm.pharmaflow.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
} 