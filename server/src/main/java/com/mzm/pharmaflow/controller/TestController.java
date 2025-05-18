package com.mzm.pharmaflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("PharmaFlow API is running!");
    }
    
    @GetMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Echo test successful");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/server-info")
    public ResponseEntity<Map<String, Object>> getServerInfo() {
        Map<String, Object> info = new HashMap<>();
        
        info.put("java.version", System.getProperty("java.version"));
        info.put("java.vendor", System.getProperty("java.vendor"));
        info.put("os.name", System.getProperty("os.name"));
        info.put("os.arch", System.getProperty("os.arch"));
        info.put("user.name", System.getProperty("user.name"));
        info.put("user.timezone", System.getProperty("user.timezone"));
        
        return ResponseEntity.ok(info);
    }
    
    @GetMapping("/check-db")
    public ResponseEntity<Map<String, Object>> checkDb() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Test query to get product count
            int productCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM products", Integer.class);
            
            // Test query to get actual products
            List<Map<String, Object>> products = jdbcTemplate.queryForList(
                "SELECT id, name, code, category FROM products LIMIT 5");
            
            response.put("status", "success");
            response.put("message", "Database connection successful");
            response.put("productCount", productCount);
            response.put("sampleProducts", products);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Database error: " + e.getMessage());
            response.put("error", e.getClass().getName());
            return ResponseEntity.status(500).body(response);
        }
    }
} 