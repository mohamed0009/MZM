package com.mzm.pharmaflow.controller;

import com.mzm.pharmaflow.config.PermissionConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Contrôleur pour vérifier les permissions des utilisateurs.
 * Permet au frontend de vérifier si un utilisateur a certaines permissions.
 */
@RestController
@RequestMapping("/permissions")
@CrossOrigin(origins = "${spring.web.cors.allowed-origins}")
public class PermissionController {

    private final PermissionConfig permissionConfig;

    @Autowired
    public PermissionController(PermissionConfig permissionConfig) {
        this.permissionConfig = permissionConfig;
    }

    /**
     * Vérifie si un rôle a une permission spécifique.
     * 
     * @param role le rôle à vérifier
     * @param permission la permission à vérifier
     * @return true si le rôle a la permission, false sinon
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkPermission(
            @RequestParam String role,
            @RequestParam String permission) {
        
        boolean hasPermission = permissionConfig.hasPermission(role, permission);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("hasPermission", hasPermission);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Obtient toutes les permissions pour un rôle donné.
     * 
     * @param role le rôle dont on veut connaître les permissions
     * @return la liste des permissions du rôle
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<Map<String, Object>> getPermissionsForRole(
            @PathVariable String role) {
        
        Map<String, Set<String>> allPermissions = permissionConfig.rolePermissionsMap();
        Set<String> rolePermissions = allPermissions.getOrDefault(role, Collections.emptySet());
        
        Map<String, Object> response = new HashMap<>();
        response.put("role", role);
        response.put("permissions", rolePermissions);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Obtient toutes les permissions pour tous les rôles.
     * Utile pour le frontend pour synchroniser les permissions.
     * 
     * @return un mapping de tous les rôles et leurs permissions
     */
    @GetMapping("/all")
    public ResponseEntity<Map<String, Set<String>>> getAllPermissions() {
        return ResponseEntity.ok(permissionConfig.rolePermissionsMap());
    }
} 