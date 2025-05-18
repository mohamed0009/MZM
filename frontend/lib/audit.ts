/**
 * Audit Logging System for PharmaFlow
 * 
 * This system provides comprehensive audit logging for all user actions
 * to meet regulatory requirements and security best practices in the
 * pharmaceutical sector.
 */

import { ResourceType, ActionType } from './permissions';

// Audit log severity levels
export type AuditSeverity = 'info' | 'warning' | 'critical';

// Audit log entry with detailed metadata
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: ActionType | 'login' | 'logout' | 'access' | 'emergency';
  resourceType: ResourceType | 'system' | 'session';
  resourceId?: string;
  description: string;
  previousState?: any;
  newState?: any;
  ipAddress: string;
  userAgent: string;
  siteId?: string;
  severity: AuditSeverity;
  relatedEntries?: string[]; // References to related audit entries
  metadata?: Record<string, any>;
  successful: boolean;
  failureReason?: string;
}

// Filter interface for querying audit logs
export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  userRole?: string;
  actions?: string[];
  resourceTypes?: string[];
  resourceId?: string;
  severity?: AuditSeverity[];
  successful?: boolean;
  siteId?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

/**
 * Creates a new audit log entry
 */
export async function createAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<string> {
  try {
    // In a real implementation, this would insert the record into a database
    // via an API call and return the ID
    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date();
    
    console.log('AUDIT LOG:', { ...entry, id, timestamp });
    
    // Sensitive operations should be logged to a separate secure storage
    if (entry.severity === 'critical' || 
        entry.action === 'emergency' || 
        entry.resourceType === 'system') {
      console.log('CRITICAL AUDIT EVENT DETECTED - Logging to secure storage');
    }
    
    return id;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // In a production system, this would use a fallback logging mechanism
    // to ensure audit events are never lost
    return 'fallback-' + Date.now();
  }
}

/**
 * Retrieves audit logs based on filter criteria
 */
export async function getAuditLogs(filter: AuditLogFilter): Promise<{
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    // This would make an API call to fetch filtered logs
    // Mock implementation for development
    return {
      entries: [],
      total: 0,
      page: filter.page || 1,
      pageSize: filter.limit || 20
    };
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    throw new Error('Failed to retrieve audit logs');
  }
}

/**
 * Creates an audit trail for data changes
 */
export async function auditDataChange<T>(
  userId: string,
  userName: string,
  userRole: string,
  resourceType: ResourceType,
  resourceId: string,
  action: ActionType,
  previousState: T | null,
  newState: T,
  ipAddress: string,
  userAgent: string,
  siteId?: string
): Promise<string> {
  // Determine severity based on action and resource type
  let severity: AuditSeverity = 'info';
  
  // Elevated severity for critical resources or destructive actions
  if (resourceType === 'users' || resourceType === 'prescriptions') {
    severity = 'warning';
  }
  
  if (action === 'delete') {
    severity = 'warning';
  }
  
  // Create readable description
  const description = `User ${userName} ${action}d ${resourceType} (ID: ${resourceId})`;
  
  return createAuditLog({
    userId,
    userName,
    userRole,
    action,
    resourceType,
    resourceId,
    description,
    previousState,
    newState,
    ipAddress,
    userAgent,
    siteId,
    severity,
    successful: true,
    metadata: {
      changeDetection: detectChanges(previousState, newState)
    }
  });
}

/**
 * Detects and summarizes changes between previous and new state
 */
function detectChanges<T>(previous: T | null, current: T): Record<string, { from: any, to: any }> {
  if (!previous) {
    return { _new: { from: null, to: 'New resource created' } };
  }
  
  const changes: Record<string, { from: any, to: any }> = {};
  
  // Compare each property
  Object.keys(current as any).forEach(key => {
    const prevValue = (previous as any)[key];
    const newValue = (current as any)[key];
    
    // Only record actual changes
    if (JSON.stringify(prevValue) !== JSON.stringify(newValue)) {
      changes[key] = {
        from: prevValue,
        to: newValue
      };
    }
  });
  
  return changes;
}

/**
 * Logs security-related events
 */
export async function logSecurityEvent(
  userId: string,
  userName: string,
  userRole: string,
  action: 'login' | 'logout' | 'access' | 'emergency' | 'permission_change',
  description: string,
  successful: boolean,
  ipAddress: string,
  userAgent: string,
  failureReason?: string
): Promise<string> {
  return createAuditLog({
    userId,
    userName,
    userRole,
    action: action as any,
    resourceType: 'system',
    description,
    ipAddress,
    userAgent,
    severity: successful ? 'info' : 'critical',
    successful,
    failureReason
  });
} 