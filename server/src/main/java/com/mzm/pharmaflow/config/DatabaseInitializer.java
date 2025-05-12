package com.mzm.pharmaflow.config;

import com.mzm.pharmaflow.model.ERole;
import com.mzm.pharmaflow.model.Role;
import com.mzm.pharmaflow.model.User;
import com.mzm.pharmaflow.repository.RoleRepository;
import com.mzm.pharmaflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DatabaseInitializer {

    @Bean
    public CommandLineRunner initDatabase(RoleRepository roleRepository, 
                                          UserRepository userRepository,
                                          PasswordEncoder encoder) {
        return args -> {
            // Create roles if not exist
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(ERole.ROLE_USER));
                roleRepository.save(new Role(ERole.ROLE_PHARMACIST));
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
                System.out.println("Roles initialized");
            }

            // Create admin user if not exist
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@pharmaflow.com");
                admin.setPassword(encoder.encode("Admin123!"));
                
                Set<Role> roles = new HashSet<>();
                roleRepository.findByName(ERole.ROLE_ADMIN).ifPresent(roles::add);
                admin.setRoles(roles);
                
                userRepository.save(admin);
                System.out.println("Admin user created");
            }
        };
    }
} 