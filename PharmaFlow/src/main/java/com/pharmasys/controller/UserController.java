package com.pharmasys.controller;

import com.pharmasys.model.ERole;
import com.pharmasys.model.Role;
import com.pharmasys.model.User;
import com.pharmasys.payload.response.MessageResponse;
import com.pharmasys.repository.RoleRepository;
import com.pharmasys.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {
        Optional<User> userData = userRepository.findById(id);

        if (userData.isPresent()) {
            return new ResponseEntity<>(userData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<?> updateUser(@PathVariable("id") long id, @Valid @RequestBody User user) {
        Optional<User> userData = userRepository.findById(id);

        if (userData.isPresent()) {
            User _user = userData.get();
            
            // Check if email is being changed and if it's already in use
            if (!_user.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }
            
            _user.setName(user.getName());
            _user.setEmail(user.getEmail());
            _user.setPharmacyName(user.getPharmacyName());
            
            // Only admin can change roles
            if (user.getRoles() != null && !user.getRoles().isEmpty() && hasRole("ROLE_ADMIN")) {
                Set<Role> roles = new HashSet<>();
                
                user.getRoles().forEach(role -> {
                    Optional<Role> roleData = roleRepository.findById(role.getId());
                    if (roleData.isPresent()) {
                        roles.add(roleData.get());
                    }
                });
                
                if (!roles.isEmpty()) {
                    _user.setRoles(roles);
                }
            }
            
            return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<?> changePassword(@PathVariable("id") long id, @RequestBody PasswordChangeRequest passwordChangeRequest) {
        Optional<User> userData = userRepository.findById(id);

        if (userData.isPresent()) {
            User user = userData.get();
            
            // Encode the new password
            user.setPassword(encoder.encode(passwordChangeRequest.getNewPassword()));
            
            userRepository.save(user);
            
            return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") long id) {
        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    private boolean hasRole(String roleName) {
        return true; // This is a placeholder. In a real application, you would check the current user's roles.
    }
    
    static class PasswordChangeRequest {
        private String newPassword;
        
        public String getNewPassword() {
            return newPassword;
        }
        
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
