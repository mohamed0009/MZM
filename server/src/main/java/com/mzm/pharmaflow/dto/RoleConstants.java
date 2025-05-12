package com.mzm.pharmaflow.dto;

/**
 * Constantes pour les rôles utilisateur, synchronisées avec le frontend.
 * Ces constantes garantissent la cohérence entre le frontend et le backend.
 */
public class RoleConstants {
    // Rôles définis exactement comme dans le contexte d'authentification frontend
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_PHARMACIST = "PHARMACIST";
    public static final String ROLE_TECHNICIAN = "TECHNICIAN";
    
    // Permissions alignées avec celles définies dans le frontend
    public static final String PERMISSION_MANAGE_USERS = "manage_users";
    public static final String PERMISSION_VIEW_REPORTS = "view_reports";
    public static final String PERMISSION_MANAGE_INVENTORY = "manage_inventory";
    public static final String PERMISSION_APPROVE_PRESCRIPTIONS = "approve_prescriptions";
    public static final String PERMISSION_MANAGE_CLIENTS = "manage_clients";
    public static final String PERMISSION_VIEW_DASHBOARD = "view_dashboard";
} 