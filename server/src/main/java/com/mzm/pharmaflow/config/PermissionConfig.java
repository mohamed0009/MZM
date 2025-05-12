package com.mzm.pharmaflow.config;

import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Configuration for role-based permissions.
 * Defines which roles have access to which permissions.
 */
@Configuration
public class PermissionConfig {

    private final Map<String, Set<String>> rolePermissionsMap = new HashMap<>();

    public PermissionConfig() {
        // Initialize permissions for different roles
        
        // Admin permissions
        Set<String> adminPermissions = new HashSet<>();
        adminPermissions.add("inventory.view");
        adminPermissions.add("inventory.add");
        adminPermissions.add("inventory.edit");
        adminPermissions.add("inventory.delete");
        adminPermissions.add("clients.view");
        adminPermissions.add("clients.add");
        adminPermissions.add("clients.edit");
        adminPermissions.add("clients.delete");
        adminPermissions.add("users.view");
        adminPermissions.add("users.add");
        adminPermissions.add("users.edit");
        adminPermissions.add("users.delete");
        adminPermissions.add("reports.view");
        adminPermissions.add("reports.generate");
        rolePermissionsMap.put("ROLE_ADMIN", adminPermissions);
        
        // Pharmacist permissions
        Set<String> pharmacistPermissions = new HashSet<>();
        pharmacistPermissions.add("inventory.view");
        pharmacistPermissions.add("inventory.add");
        pharmacistPermissions.add("inventory.edit");
        pharmacistPermissions.add("clients.view");
        pharmacistPermissions.add("clients.add");
        pharmacistPermissions.add("clients.edit");
        pharmacistPermissions.add("reports.view");
        rolePermissionsMap.put("ROLE_PHARMACIST", pharmacistPermissions);
        
        // User permissions
        Set<String> userPermissions = new HashSet<>();
        userPermissions.add("inventory.view");
        userPermissions.add("clients.view");
        rolePermissionsMap.put("ROLE_USER", userPermissions);
    }

    /**
     * Checks if a role has a specific permission.
     * 
     * @param role the role to check
     * @param permission the permission to check for
     * @return true if the role has the permission, false otherwise
     */
    public boolean hasPermission(String role, String permission) {
        Set<String> permissions = rolePermissionsMap.getOrDefault(role, Collections.emptySet());
        return permissions.contains(permission);
    }

    /**
     * Gets all role-permission mappings.
     * 
     * @return the map of roles to their permissions
     */
    public Map<String, Set<String>> rolePermissionsMap() {
        return rolePermissionsMap;
    }
} 