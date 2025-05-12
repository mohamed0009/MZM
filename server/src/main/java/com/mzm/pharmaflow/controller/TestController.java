package com.mzm.pharmaflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Le serveur backend fonctionne correctement!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo() {
        Map<String, Object> response = new HashMap<>();
        response.put("echo", "ok");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "UP");
        response.put("message", "Backend service is running");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        health.put("service", "PharmaFlow Backend");
        health.put("version", "1.0.0");
        
        return ResponseEntity.ok(health);
    }
} 