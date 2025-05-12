package com.mzm.pharmaflow.config;

import com.mzm.pharmaflow.dto.RoleConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

/**
 * Configuration des permissions par rôle, alignée avec le contexte d'authentification frontend.
 * Cette classe reproduit la même structure de permissions que celle définie dans auth-context.tsx.
 */
@Configuration
public class PermissionConfig {

    @Bean
    public Map<String, Set<String>> rolePermissionsMap() {
        Map<String, Set<String>> permissions = new HashMap<>();
        
        // Permissions pour ADMIN - toutes les permissions
        permissions.put(RoleConstants.ROLE_ADMIN, new HashSet<>(Arrays.asList(
            RoleConstants.PERMISSION_MANAGE_USERS,
            RoleConstants.PERMISSION_VIEW_REPORTS,
            RoleConstants.PERMISSION_MANAGE_INVENTORY,
            RoleConstants.PERMISSION_APPROVE_PRESCRIPTIONS,
            RoleConstants.PERMISSION_MANAGE_CLIENTS,
            RoleConstants.PERMISSION_VIEW_DASHBOARD
        )));
        
        // Permissions pour PHARMACIST
        permissions.put(RoleConstants.ROLE_PHARMACIST, new HashSet<>(Arrays.asList(
            RoleConstants.PERMISSION_VIEW_REPORTS,
            RoleConstants.PERMISSION_MANAGE_INVENTORY,
            RoleConstants.PERMISSION_APPROVE_PRESCRIPTIONS,
            RoleConstants.PERMISSION_MANAGE_CLIENTS,
            RoleConstants.PERMISSION_VIEW_DASHBOARD
        )));
        
        // Permissions pour TECHNICIAN
        permissions.put(RoleConstants.ROLE_TECHNICIAN, new HashSet<>(Arrays.asList(
            RoleConstants.PERMISSION_MANAGE_INVENTORY,
            RoleConstants.PERMISSION_MANAGE_CLIENTS,
            RoleConstants.PERMISSION_VIEW_DASHBOARD
        )));
        
        return permissions;
    }
    
    /**
     * Vérifie si un rôle a une permission spécifique.
     * Cette méthode peut être utilisée par les services ou contrôleurs pour vérifier les permissions.
     * 
     * @param role le rôle de l'utilisateur
     * @param permission la permission à vérifier
     * @return true si le rôle a la permission, false sinon
     */
    public boolean hasPermission(String role, String permission) {
        Map<String, Set<String>> permissionsMap = rolePermissionsMap();
        
        if (!permissionsMap.containsKey(role)) {
            return false;
        }
        
        return permissionsMap.get(role).contains(permission);
    }
} 