package com.mzm.pharmaflow.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.mzm.pharmaflow.dto.LoginRequest;
import com.mzm.pharmaflow.dto.LoginResponse;
import com.mzm.pharmaflow.dto.RegisterRequest;
import com.mzm.pharmaflow.dto.RoleConstants;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import javax.crypto.SecretKey;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "${spring.web.cors.allowed-origins}")
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final Map<String, Map<String, Object>> userDatabase = new ConcurrentHashMap<>();
    private final SecretKey jwtKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private long jwtExpiration;

    public AuthController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        // Add some test users
        addTestUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Find user by email
        Optional<Map.Entry<String, Map<String, Object>>> userEntry = userDatabase.entrySet().stream()
                .filter(entry -> loginRequest.getEmail().equals(entry.getValue().get("email")))
                .findFirst();

        if (userEntry.isPresent()) {
            Map<String, Object> user = userEntry.get().getValue();
            String storedPassword = (String) user.get("password");
            
            // Check password
            if (passwordEncoder.matches(loginRequest.getPassword(), storedPassword)) {
                // Generate JWT token
                String token = generateToken(userEntry.get().getKey());
                
                // Create user object without password
                Map<String, Object> userResponse = new HashMap<>(user);
                userResponse.remove("password");
                
                return ResponseEntity.ok(new LoginResponse(token, userResponse));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("message", "Invalid credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // Check if email already exists
        boolean emailExists = userDatabase.values().stream()
                .anyMatch(user -> registerRequest.getEmail().equals(user.get("email")));
                
        if (emailExists) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Email already in use"));
        }
        
        // Validate role
        String role = registerRequest.getRole();
        if (!isValidRole(role)) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", "Invalid role. Must be ADMIN, PHARMACIST, or TECHNICIAN"));
        }
        
        // Create new user
        String userId = UUID.randomUUID().toString();
        Map<String, Object> newUser = new HashMap<>();
        newUser.put("id", userId);
        newUser.put("email", registerRequest.getEmail());
        newUser.put("password", passwordEncoder.encode(registerRequest.getPassword()));
        newUser.put("firstName", registerRequest.getFirstName());
        newUser.put("lastName", registerRequest.getLastName());
        newUser.put("name", registerRequest.getFirstName() + " " + registerRequest.getLastName());
        newUser.put("role", registerRequest.getRole());
        
        // Save to our in-memory database
        userDatabase.put(userId, newUser);
        
        // Generate token
        String token = generateToken(userId);
        
        // Create user object without password for response
        Map<String, Object> userResponse = new HashMap<>(newUser);
        userResponse.remove("password");
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new LoginResponse(token, userResponse));
    }

    private String generateToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtKey)
                .compact();
    }
    
    private boolean isValidRole(String role) {
        return role != null && (
            role.equals(RoleConstants.ROLE_ADMIN) || 
            role.equals(RoleConstants.ROLE_PHARMACIST) || 
            role.equals(RoleConstants.ROLE_TECHNICIAN)
        );
    }
    
    private void addTestUsers() {
        // Admin user
        String adminId = UUID.randomUUID().toString();
        Map<String, Object> admin = new HashMap<>();
        admin.put("id", adminId);
        admin.put("email", "admin@example.com");
        admin.put("password", passwordEncoder.encode("admin123"));
        admin.put("firstName", "Admin");
        admin.put("lastName", "User");
        admin.put("name", "Admin User");
        admin.put("role", RoleConstants.ROLE_ADMIN);
        userDatabase.put(adminId, admin);
        
        // Pharmacist user
        String pharmacistId = UUID.randomUUID().toString();
        Map<String, Object> pharmacist = new HashMap<>();
        pharmacist.put("id", pharmacistId);
        pharmacist.put("email", "pharmacist@example.com");
        pharmacist.put("password", passwordEncoder.encode("pharma123"));
        pharmacist.put("firstName", "Pharmacist");
        pharmacist.put("lastName", "User");
        pharmacist.put("name", "Pharmacist User");
        pharmacist.put("role", RoleConstants.ROLE_PHARMACIST);
        userDatabase.put(pharmacistId, pharmacist);
        
        // Technician user
        String technicianId = UUID.randomUUID().toString();
        Map<String, Object> technician = new HashMap<>();
        technician.put("id", technicianId);
        technician.put("email", "tech@example.com");
        technician.put("password", passwordEncoder.encode("tech123"));
        technician.put("firstName", "Technician");
        technician.put("lastName", "User");
        technician.put("name", "Technician User");
        technician.put("role", RoleConstants.ROLE_TECHNICIAN);
        userDatabase.put(technicianId, technician);
    }
} 