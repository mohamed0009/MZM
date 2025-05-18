/**
 * Advanced Role-Based Access Control (RBAC) System for PharmaFlow
 * 
 * This provides a granular permissions system with role hierarchies,
 * specialized permissions, and emergency access capabilities.
 */

export type Role = 'admin' | 'pharmacist' | 'technician' | 'cashier';

export type ResourceType = 
  | 'inventory'
  | 'clients'
  | 'prescriptions'
  | 'sales'
  | 'orders'
  | 'users'
  | 'reports'
  | 'settings';

export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';

// Fine-grained permission format: resource:action
export type Permission = `${ResourceType}:${ActionType}`;

// System-wide special permissions
export type SpecialPermission = 
  | 'emergency_access'
  | 'view_audit_logs'
  | 'delegate_role'
  | 'system_config';

export type AnyPermission = Permission | SpecialPermission;

// Role definitions with granular permissions
export const ROLE_PERMISSIONS: Record<Role, AnyPermission[]> = {
  admin: [
    // Full system access
    'inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete', 
    'clients:create', 'clients:read', 'clients:update', 'clients:delete',
    'prescriptions:create', 'prescriptions:read', 'prescriptions:update', 'prescriptions:delete', 'prescriptions:approve',
    'sales:create', 'sales:read', 'sales:update', 'sales:delete',
    'orders:create', 'orders:read', 'orders:update', 'orders:delete', 'orders:approve',
    'users:create', 'users:read', 'users:update', 'users:delete',
    'reports:create', 'reports:read', 'reports:export',
    'settings:read', 'settings:update',
    
    // Special permissions
    'emergency_access',
    'view_audit_logs',
    'delegate_role',
    'system_config'
  ],

  pharmacist: [
    // Extensive operational permissions
    'inventory:create', 'inventory:read', 'inventory:update',
    'clients:create', 'clients:read', 'clients:update',
    'prescriptions:create', 'prescriptions:read', 'prescriptions:update', 'prescriptions:approve',
    'sales:create', 'sales:read',
    'orders:create', 'orders:read', 'orders:update', 'orders:approve',
    'reports:read', 'reports:export',
    'settings:read',
    
    // Limited special permissions
    'emergency_access'
  ],

  technician: [
    // Limited operational permissions
    'inventory:read', 'inventory:update',
    'clients:create', 'clients:read',
    'prescriptions:create', 'prescriptions:read',
    'sales:create', 'sales:read',
    'orders:read'
  ],

  cashier: [
    // Sales-focused permissions
    'inventory:read',
    'clients:read',
    'sales:create', 'sales:read',
    'prescriptions:read'
  ]
};

// Site-specific permission overrides for multi-site pharmacies
export interface SitePermission {
  siteId: string;
  grantedPermissions: AnyPermission[];
  deniedPermissions: AnyPermission[];
}

// User permissions with role and site-specific overrides
export interface UserPermissions {
  userId: string;
  role: Role;
  sitePermissions?: SitePermission[];
  temporaryPermissions?: {
    permissions: AnyPermission[];
    expiresAt: Date;
    grantedBy: string;
    reason: string;
  };
}

/**
 * Checks if a user has a specific permission
 */
export function hasPermission(
  userPermissions: UserPermissions,
  requiredPermission: AnyPermission,
  siteId?: string
): boolean {
  // Check temporary permissions first (if active)
  if (userPermissions.temporaryPermissions) {
    const { permissions, expiresAt } = userPermissions.temporaryPermissions;
    if (new Date() < expiresAt && permissions.includes(requiredPermission)) {
      return true;
    }
  }

  // Get base role permissions
  const rolePermissions = ROLE_PERMISSIONS[userPermissions.role] || [];
  let hasBasePermission = rolePermissions.includes(requiredPermission);

  // Check site-specific overrides if a site is specified
  if (siteId && userPermissions.sitePermissions) {
    const sitePermission = userPermissions.sitePermissions.find(
      (sp) => sp.siteId === siteId
    );

    if (sitePermission) {
      // Explicit denial overrides everything
      if (sitePermission.deniedPermissions.includes(requiredPermission)) {
        return false;
      }
      
      // Explicit grant overrides base role permissions
      if (sitePermission.grantedPermissions.includes(requiredPermission)) {
        return true;
      }
    }
  }

  return hasBasePermission;
}

/**
 * Emergency access request - grants temporary elevated permissions
 */
export async function requestEmergencyAccess(
  userId: string,
  reason: string,
  requestedPermissions: AnyPermission[]
): Promise<{
  granted: boolean;
  temporaryToken?: string;
  expiresAt?: Date;
  message: string;
}> {
  try {
    // This would make an API call in a real implementation
    // For now, it's a simulation
    console.log(`Emergency access requested by ${userId} for reason: ${reason}`);
    
    // Create expiration 30 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    
    // In real implementation, this would notify admins, log the access, etc.
    
    return {
      granted: true,
      temporaryToken: `emergency-${Date.now()}-${userId}`,
      expiresAt,
      message: "Emergency access granted for 30 minutes"
    };
  } catch (error) {
    return {
      granted: false,
      message: "Failed to grant emergency access"
    };
  }
}

/**
 * Delegate temporary permissions to another user
 */
export async function delegatePermissions(
  fromUserId: string,
  toUserId: string,
  permissions: AnyPermission[],
  duration: number, // in minutes
  reason: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // This would make an API call in a real implementation
    // For now, it's a simulation
    console.log(`User ${fromUserId} delegated permissions to ${toUserId} for ${duration} minutes`);
    
    // In real implementation, this would update the user's permissions in the database
    // and create an audit log entry
    
    return {
      success: true,
      message: `Permissions delegated successfully for ${duration} minutes`
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delegate permissions"
    };
  }
} 