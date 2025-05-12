import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * Enhanced mock server with better CORS handling and connection capabilities
 */
public class EnhancedMock {
    // Store for user data
    private static final Map<String, User> users = new ConcurrentHashMap<>();
    // Store for active tokens
    private static final Map<String, String> activeTokens = new ConcurrentHashMap<>();
    // Store for active sessions
    private static final Map<String, Session> activeSessions = new ConcurrentHashMap<>();
    // Permissions for each role
    private static final Map<String, List<String>> rolePermissions = new ConcurrentHashMap<>();
    
    // Initialize with some test users and permissions
    static {
        // Admin user with all permissions
        User admin = new User("1", "admin", "admin@example.com", "admin123", "Admin", "User", "ROLE_ADMIN");
        users.put(admin.email, admin);
        
        // Pharmacist user with pharmacy management permissions
        User pharmacist = new User("2", "pharmacist", "pharmacist@example.com", "pharma123", "Pharmacist", "User", "ROLE_PHARMACIST");
        users.put(pharmacist.email, pharmacist);
        
        // Technician user with limited permissions
        User technician = new User("3", "technician", "tech@example.com", "tech123", "Technician", "User", "ROLE_TECHNICIAN");
        users.put(technician.email, technician);
        
        // Initialize role permissions
        List<String> adminPermissions = new ArrayList<>();
        adminPermissions.add("VIEW_CLIENTS");
        adminPermissions.add("EDIT_CLIENTS");
        adminPermissions.add("VIEW_INVENTORY");
        adminPermissions.add("EDIT_INVENTORY");
        adminPermissions.add("MANAGE_USERS");
        adminPermissions.add("VIEW_REPORTS");
        adminPermissions.add("MANAGE_SYSTEM");
        rolePermissions.put("ROLE_ADMIN", adminPermissions);
        
        List<String> pharmacistPermissions = new ArrayList<>();
        pharmacistPermissions.add("VIEW_CLIENTS");
        pharmacistPermissions.add("EDIT_CLIENTS");
        pharmacistPermissions.add("VIEW_INVENTORY");
        pharmacistPermissions.add("EDIT_INVENTORY");
        pharmacistPermissions.add("VIEW_REPORTS");
        rolePermissions.put("ROLE_PHARMACIST", pharmacistPermissions);
        
        List<String> technicianPermissions = new ArrayList<>();
        technicianPermissions.add("VIEW_CLIENTS");
        technicianPermissions.add("VIEW_INVENTORY");
        rolePermissions.put("ROLE_TECHNICIAN", technicianPermissions);
    }
    
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.setExecutor(Executors.newFixedThreadPool(10)); // Use a real thread pool
        
        // Basic endpoints
        server.createContext("/api", new DefaultHandler());
        server.createContext("/api/test/echo", new EchoHandler());
        server.createContext("/api/health", new HealthHandler());
        
        // Auth endpoints
        server.createContext("/api/auth/test", new AuthTestHandler());
        server.createContext("/api/auth/login", new LoginHandler());
        server.createContext("/api/auth/register", new RegisterHandler());
        server.createContext("/api/auth/validate", new ValidateTokenHandler());
        server.createContext("/api/auth/logout", new LogoutHandler());
        server.createContext("/api/auth/session", new SessionInfoHandler());
        
        // Role-specific endpoints
        server.createContext("/api/admin/dashboard", new RoleRestrictedHandler(new AdminDashboardHandler(), "ROLE_ADMIN"));
        server.createContext("/api/pharmacist/dashboard", new RoleRestrictedHandler(new PharmacistDashboardHandler(), "ROLE_PHARMACIST"));
        server.createContext("/api/technician/dashboard", new RoleRestrictedHandler(new TechnicianDashboardHandler(), "ROLE_TECHNICIAN"));
        
        // Permission-based endpoints
        server.createContext("/api/inventory/products", new PermissionRestrictedHandler(new ProductsHandler(), "VIEW_INVENTORY"));
        server.createContext("/api/inventory/update", new PermissionRestrictedHandler(new InventoryUpdateHandler(), "EDIT_INVENTORY"));
        server.createContext("/api/clients", new PermissionRestrictedHandler(new ClientsHandler(), "VIEW_CLIENTS"));
        server.createContext("/api/clients/update", new PermissionRestrictedHandler(new ClientUpdateHandler(), "EDIT_CLIENTS"));
        server.createContext("/api/permissions/all", new PermissionRestrictedHandler(new PermissionsHandler(), "VIEW_INVENTORY"));
        server.createContext("/api/system/users", new PermissionRestrictedHandler(new UsersHandler(), "MANAGE_USERS"));
        
        // Start server
        server.start();
        
        System.out.println("=======================================================");
        System.out.println("         Enhanced Mock Backend Server Started");
        System.out.println("         API available at: http://localhost:8080/api");
        System.out.println("         Test API: http://localhost:8080/api/test/echo");
        System.out.println("=======================================================");
    }
    
    // Session class to store session information
    static class Session {
        String sessionId;
        String userId;
        String role;
        Date createdAt;
        Date expiresAt;
        String ipAddress;
        boolean active;
        
        Session(String sessionId, String userId, String role, String ipAddress) {
            this.sessionId = sessionId;
            this.userId = userId;
            this.role = role;
            this.createdAt = new Date();
            // Sessions expire after 24 hours
            this.expiresAt = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000);
            this.ipAddress = ipAddress;
            this.active = true;
        }
        
        Map<String, Object> toJson() {
            Map<String, Object> json = new HashMap<>();
            json.put("sessionId", sessionId);
            json.put("userId", userId);
            json.put("role", role);
            json.put("createdAt", createdAt.getTime());
            json.put("expiresAt", expiresAt.getTime());
            json.put("ipAddress", ipAddress);
            json.put("active", active);
            return json;
        }
        
        boolean isExpired() {
            return !active || new Date().after(expiresAt);
        }
    }
    
    // User class to store user information
    static class User {
        String id;
        String username;
        String email;
        String password;
        String firstName;
        String lastName;
        String role;
        
        User(String id, String username, String email, String password, String firstName, String lastName, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
        }
        
        Map<String, Object> toJson(boolean includePassword) {
            Map<String, Object> json = new HashMap<>();
            json.put("id", id);
            json.put("username", username);
            json.put("email", email);
            if (includePassword) {
                json.put("password", password);
            }
            json.put("firstName", firstName);
            json.put("lastName", lastName);
            json.put("name", firstName + " " + lastName);
            json.put("role", role);
            return json;
        }
    }
    
    // Generate JWT token with session creation
    private static String generateToken(String userId, String role, String ipAddress) {
        String token = UUID.randomUUID().toString() + "-" + userId;
        String encodedToken = Base64.getEncoder().encodeToString(token.getBytes(StandardCharsets.UTF_8));
        activeTokens.put(encodedToken, userId);
        
        // Create and store session
        Session session = new Session(encodedToken, userId, role, ipAddress);
        activeSessions.put(encodedToken, session);
        
        return encodedToken;
    }
    
    // Validate JWT token and session
    private static User validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        // Check if token exists
        String userId = activeTokens.get(token);
        if (userId == null) {
            return null;
        }
        
        // Check if session is valid
        Session session = activeSessions.get(token);
        if (session == null || session.isExpired()) {
            // Clean up expired sessions
            if (session != null && session.isExpired()) {
                activeTokens.remove(token);
                activeSessions.remove(token);
            }
            return null;
        }
        
        // Find user by ID
        for (User user : users.values()) {
            if (user.id.equals(userId)) {
                return user;
            }
        }
        
        return null;
    }
    
    // Check if user has a specific permission
    private static boolean hasPermission(String role, String permission) {
        List<String> permissions = rolePermissions.get(role);
        return permissions != null && permissions.contains(permission);
    }
    
    // Read request body as string
    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        }
    }
    
    // Parse simple JSON (for login/register requests)
    private static Map<String, String> parseJson(String json) {
        Map<String, String> result = new HashMap<>();
        // Simple JSON parser for key-value pairs
        json = json.trim();
        if (json.startsWith("{") && json.endsWith("}")) {
            json = json.substring(1, json.length() - 1);
            String[] pairs = json.split(",");
            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim().replace("\"", "");
                    String value = keyValue[1].trim().replace("\"", "");
                    result.put(key, value);
                }
            }
        }
        return result;
    }
    
    // CORS headers handler - Accept all origins
    private static void addCorsHeaders(HttpExchange exchange) {
        String origin = exchange.getRequestHeaders().getFirst("Origin");
        
        // Accept any origin
        if (origin != null) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", origin);
        } else {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        }
        
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "3600");
        
        // Explicit setting for preflight requests
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
        }
    }
    
    // Handle preflight OPTIONS requests
    private static boolean handlePreflight(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);
        
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return true;
        }
        return false;
    }
    
    // Send a JSON response
    private static void sendJsonResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        addCorsHeaders(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Cache-Control", "no-cache, no-store, must-revalidate");
        exchange.getResponseHeaders().set("Pragma", "no-cache");
        exchange.getResponseHeaders().set("Expires", "0");
        
        byte[] responseBytes = response.getBytes("UTF-8");
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        } finally {
            exchange.close();
        }
    }
    
    // Send a JSON response with 200 status
    private static void sendJsonResponse(HttpExchange exchange, String response) throws IOException {
        sendJsonResponse(exchange, response, 200);
    }
    
    // Wrapper for handlers that require a specific role
    static class RoleRestrictedHandler implements HttpHandler {
        private final HttpHandler handler;
        private final String requiredRole;
        
        public RoleRestrictedHandler(HttpHandler handler, String requiredRole) {
            this.handler = handler;
            this.requiredRole = requiredRole;
        }
        
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Get authorization header
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            User user = validateToken(authHeader);
            
            if (user == null) {
                // Unauthorized
                String response = "{\n" +
                        "  \"error\": \"Unauthorized\",\n" +
                        "  \"message\": \"Valid authentication token is required\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 401);
                return;
            }
            
            // Check if user has the required role
            if (!user.role.equals(requiredRole)) {
                // Forbidden
                String response = "{\n" +
                        "  \"error\": \"Forbidden\",\n" +
                        "  \"message\": \"You do not have permission to access this resource\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 403);
                return;
            }
            
            // Store authenticated user in request attribute
            exchange.setAttribute("user", user);
            
            // Call the original handler
            handler.handle(exchange);
        }
    }
    
    // Wrapper for handlers that require a specific permission
    static class PermissionRestrictedHandler implements HttpHandler {
        private final HttpHandler handler;
        private final String requiredPermission;
        
        public PermissionRestrictedHandler(HttpHandler handler, String requiredPermission) {
            this.handler = handler;
            this.requiredPermission = requiredPermission;
        }
        
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Get authorization header
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            User user = validateToken(authHeader);
            
            if (user == null) {
                // Unauthorized
                String response = "{\n" +
                        "  \"error\": \"Unauthorized\",\n" +
                        "  \"message\": \"Valid authentication token is required\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 401);
                return;
            }
            
            // Check if user has the required permission
            if (!hasPermission(user.role, requiredPermission)) {
                // Forbidden
                String response = "{\n" +
                        "  \"error\": \"Forbidden\",\n" +
                        "  \"message\": \"You do not have the required permission: " + requiredPermission + "\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 403);
                return;
            }
            
            // Store authenticated user in request attribute
            exchange.setAttribute("user", user);
            
            // Call the original handler
            handler.handle(exchange);
        }
    }
    
    static class SessionInfoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Get authorization header
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            User user = validateToken(authHeader);
            
            if (user == null) {
                // Unauthorized
                String response = "{\n" +
                        "  \"error\": \"Unauthorized\",\n" +
                        "  \"message\": \"Valid authentication token is required\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 401);
                return;
            }
            
            // Get session info
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            Session session = activeSessions.get(token);
            
            // Create response with role information and permissions
            StringBuilder permissionsJson = new StringBuilder();
            List<String> permissions = rolePermissions.get(user.role);
            if (permissions != null) {
                for (int i = 0; i < permissions.size(); i++) {
                    permissionsJson.append("    \"").append(permissions.get(i)).append("\"");
                    if (i < permissions.size() - 1) {
                        permissionsJson.append(",\n");
                    } else {
                        permissionsJson.append("\n");
                    }
                }
            }
            
            String response = "{\n" +
                    "  \"user\": {\n" +
                    "    \"id\": \"" + user.id + "\",\n" +
                    "    \"username\": \"" + user.username + "\",\n" +
                    "    \"email\": \"" + user.email + "\",\n" +
                    "    \"firstName\": \"" + user.firstName + "\",\n" +
                    "    \"lastName\": \"" + user.lastName + "\",\n" +
                    "    \"name\": \"" + user.firstName + " " + user.lastName + "\",\n" +
                    "    \"role\": \"" + user.role + "\"\n" +
                    "  },\n" +
                    "  \"session\": {\n" +
                    "    \"id\": \"" + session.sessionId + "\",\n" +
                    "    \"createdAt\": " + session.createdAt.getTime() + ",\n" +
                    "    \"expiresAt\": " + session.expiresAt.getTime() + ",\n" +
                    "    \"ipAddress\": \"" + session.ipAddress + "\",\n" +
                    "    \"active\": " + session.active + "\n" +
                    "  },\n" +
                    "  \"permissions\": [\n" +
                    permissionsJson +
                    "  ]\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    // Login handler with improved session management
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            if (!"POST".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                        "  \"error\": \"Method not allowed\",\n" +
                        "  \"message\": \"Use POST method for login\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 405);
                return;
            }
            
            // Read request body
            String requestBody = readRequestBody(exchange);
            Map<String, String> credentials = parseJson(requestBody);
            
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            // Get client IP address
            String ipAddress = exchange.getRemoteAddress().getAddress().getHostAddress();
            
            // Validate credentials
            User user = users.get(email);
            
            if (user != null && user.password.equals(password)) {
                // Generate token with session
                String token = generateToken(user.id, user.role, ipAddress);
                
                // Prepare response
                String response = "{\n" +
                        "  \"token\": \"" + token + "\",\n" +
                        "  \"user\": {\n" +
                        "    \"id\": \"" + user.id + "\",\n" +
                        "    \"username\": \"" + user.username + "\",\n" +
                        "    \"email\": \"" + user.email + "\",\n" +
                        "    \"firstName\": \"" + user.firstName + "\",\n" +
                        "    \"lastName\": \"" + user.lastName + "\",\n" +
                        "    \"name\": \"" + user.firstName + " " + user.lastName + "\",\n" +
                        "    \"role\": \"" + user.role + "\"\n" +
                        "  }\n" +
                        "}";
                
                System.out.println("User logged in: " + email + " with role: " + user.role);
                sendJsonResponse(exchange, response);
            } else {
                // For demo purposes, allow any login to succeed with the specified role
                if (email != null && !email.isEmpty()) {
                    String requestedRole = "ROLE_USER"; // Default role
                    
                    // Determine role based on email domain or pattern
                    if (email.contains("admin")) {
                        requestedRole = "ROLE_ADMIN";
                        user = users.get("admin@example.com");
                    } else if (email.contains("pharma")) {
                        requestedRole = "ROLE_PHARMACIST";
                        user = users.get("pharmacist@example.com");
                    } else if (email.contains("tech")) {
                        requestedRole = "ROLE_TECHNICIAN";
                        user = users.get("tech@example.com");
                    } else {
                        // Default to admin for other emails
                        user = users.get("admin@example.com");
                        requestedRole = "ROLE_ADMIN";
                    }
                    
                    String token = generateToken(user.id, user.role, ipAddress);
                    
                    String response = "{\n" +
                            "  \"token\": \"" + token + "\",\n" +
                            "  \"user\": {\n" +
                            "    \"id\": \"" + user.id + "\",\n" +
                            "    \"username\": \"" + user.username + "\",\n" +
                            "    \"email\": \"" + user.email + "\",\n" +
                            "    \"firstName\": \"" + user.firstName + "\",\n" +
                            "    \"lastName\": \"" + user.lastName + "\",\n" +
                            "    \"name\": \"" + user.firstName + " " + user.lastName + "\",\n" +
                            "    \"role\": \"" + user.role + "\"\n" +
                            "  }\n" +
                            "}";
                    
                    System.out.println("Demo login with: " + email + " (using role-based account: " + user.role + ")");
                    sendJsonResponse(exchange, response);
                    return;
                }
                
                String response = "{\n" +
                        "  \"error\": \"Invalid credentials\",\n" +
                        "  \"message\": \"Email or password is incorrect\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 401);
            }
        }
    }
    
    // Role-specific dashboard handlers
    static class AdminDashboardHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"dashboard\": \"Admin Dashboard\",\n" +
                    "  \"metrics\": {\n" +
                    "    \"totalUsers\": " + users.size() + ",\n" +
                    "    \"activeSessions\": " + activeSessions.size() + ",\n" +
                    "    \"systemStatus\": \"Healthy\"\n" +
                    "  },\n" +
                    "  \"actions\": [\n" +
                    "    \"Manage Users\",\n" +
                    "    \"System Configuration\",\n" +
                    "    \"View Reports\",\n" +
                    "    \"Manage Inventory\",\n" +
                    "    \"Manage Clients\"\n" +
                    "  ]\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class PharmacistDashboardHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"dashboard\": \"Pharmacist Dashboard\",\n" +
                    "  \"metrics\": {\n" +
                    "    \"pendingPrescriptions\": 12,\n" +
                    "    \"productsLowStock\": 3,\n" +
                    "    \"clientsToday\": 8\n" +
                    "  },\n" +
                    "  \"actions\": [\n" +
                    "    \"Dispense Medication\",\n" +
                    "    \"Manage Inventory\",\n" +
                    "    \"Client Consultations\",\n" +
                    "    \"View Reports\"\n" +
                    "  ]\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class TechnicianDashboardHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"dashboard\": \"Technician Dashboard\",\n" +
                    "  \"metrics\": {\n" +
                    "    \"pendingOrders\": 5,\n" +
                    "    \"stockChecks\": 2,\n" +
                    "    \"upcomingDeliveries\": 3\n" +
                    "  },\n" +
                    "  \"actions\": [\n" +
                    "    \"Process Orders\",\n" +
                    "    \"Check Inventory\",\n" +
                    "    \"Receive Deliveries\",\n" +
                    "    \"Client Registration\"\n" +
                    "  ]\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class InventoryUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            if (!"POST".equals(exchange.getRequestMethod()) && !"PUT".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                        "  \"error\": \"Method not allowed\",\n" +
                        "  \"message\": \"Use POST or PUT methods for inventory updates\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 405);
                return;
            }
            
            String response = "{\n" +
                    "  \"success\": true,\n" +
                    "  \"message\": \"Inventory updated successfully\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class ClientUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            if (!"POST".equals(exchange.getRequestMethod()) && !"PUT".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                        "  \"error\": \"Method not allowed\",\n" +
                        "  \"message\": \"Use POST or PUT methods for client updates\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 405);
                return;
            }
            
            String response = "{\n" +
                    "  \"success\": true,\n" +
                    "  \"message\": \"Client information updated successfully\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class UsersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            StringBuilder usersJson = new StringBuilder();
            int i = 0;
            for (User user : users.values()) {
                usersJson.append("  {\n");
                usersJson.append("    \"id\": \"").append(user.id).append("\",\n");
                usersJson.append("    \"username\": \"").append(user.username).append("\",\n");
                usersJson.append("    \"email\": \"").append(user.email).append("\",\n");
                usersJson.append("    \"firstName\": \"").append(user.firstName).append("\",\n");
                usersJson.append("    \"lastName\": \"").append(user.lastName).append("\",\n");
                usersJson.append("    \"name\": \"").append(user.firstName).append(" ").append(user.lastName).append("\",\n");
                usersJson.append("    \"role\": \"").append(user.role).append("\"\n");
                usersJson.append("  }");
                if (i < users.size() - 1) {
                    usersJson.append(",\n");
                } else {
                    usersJson.append("\n");
                }
                i++;
            }
            
            String response = "[\n" + usersJson.toString() + "]";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class DefaultHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"message\": \"PharmaFlow API is running\",\n" +
                    "  \"status\": \"UP\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class EchoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"echo\": \"ok\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + ",\n" +
                    "  \"status\": \"UP\",\n" +
                    "  \"message\": \"Backend service is running\"\n" +
                    "}";
            
            System.out.println("Echo endpoint accessed from: " + 
                exchange.getRemoteAddress() + ", Origin: " + 
                exchange.getRequestHeaders().getFirst("Origin"));
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"status\": \"UP\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + ",\n" +
                    "  \"service\": \"PharmaFlow Backend\",\n" +
                    "  \"version\": \"1.0.0\"\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class AuthTestHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Get authorization header
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            User user = validateToken(authHeader);
            
            String response;
            if (user != null) {
                response = "{\n" +
                        "  \"message\": \"Auth endpoint is working\",\n" +
                        "  \"authenticated\": true,\n" +
                        "  \"user\": \"" + user.email + "\"\n" +
                        "}";
            } else {
                response = "{\n" +
                        "  \"message\": \"Auth endpoint is working\",\n" +
                        "  \"authenticated\": false\n" +
                        "}";
            }
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            if (!"POST".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                        "  \"error\": \"Method not allowed\",\n" +
                        "  \"message\": \"Use POST method for registration\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 405);
                return;
            }
            
            // Read request body
            String requestBody = readRequestBody(exchange);
            Map<String, String> userData = parseJson(requestBody);
            
            String email = userData.get("email");
            String username = userData.get("username");
            String password = userData.get("password");
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            String role = userData.get("role");
            
            // Validate required fields
            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                String response = "{\n" +
                        "  \"error\": \"Invalid request\",\n" +
                        "  \"message\": \"Email and password are required\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 400);
                return;
            }
            
            // Check if email already exists
            if (users.containsKey(email)) {
                String response = "{\n" +
                        "  \"error\": \"Email already registered\",\n" +
                        "  \"message\": \"Email is already in use\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 409);
                return;
            }
            
            // Set default values if missing
            if (username == null || username.isEmpty()) {
                username = email.split("@")[0];
            }
            if (firstName == null || firstName.isEmpty()) {
                firstName = "New";
            }
            if (lastName == null || lastName.isEmpty()) {
                lastName = "User";
            }
            if (role == null || role.isEmpty()) {
                role = "ROLE_USER";
            }
            
            // Generate user ID
            String id = String.valueOf(users.size() + 1);
            
            // Create new user
            User newUser = new User(id, username, email, password, firstName, lastName, role);
            users.put(email, newUser);
            
            // Generate token
            String token = generateToken(newUser.id, newUser.role, "");
            
            // Prepare response
            String response = "{\n" +
                    "  \"token\": \"" + token + "\",\n" +
                    "  \"user\": {\n" +
                    "    \"id\": " + newUser.id + ",\n" +
                    "    \"username\": \"" + newUser.username + "\",\n" +
                    "    \"email\": \"" + newUser.email + "\",\n" +
                    "    \"firstName\": \"" + newUser.firstName + "\",\n" +
                    "    \"lastName\": \"" + newUser.lastName + "\",\n" +
                    "    \"name\": \"" + newUser.firstName + " " + newUser.lastName + "\",\n" +
                    "    \"role\": \"" + newUser.role + "\"\n" +
                    "  },\n" +
                    "  \"message\": \"User registered successfully\",\n" +
                    "  \"success\": true\n" +
                    "}";
            
            System.out.println("New user registered: " + email);
            sendJsonResponse(exchange, response, 201);
        }
    }
    
    static class ValidateTokenHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Get authorization header
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            User user = validateToken(authHeader);
            
            if (user != null) {
                String response = "{\n" +
                        "  \"valid\": true,\n" +
                        "  \"user\": {\n" +
                        "    \"id\": " + user.id + ",\n" +
                        "    \"username\": \"" + user.username + "\",\n" +
                        "    \"email\": \"" + user.email + "\",\n" +
                        "    \"firstName\": \"" + user.firstName + "\",\n" +
                        "    \"lastName\": \"" + user.lastName + "\",\n" +
                        "    \"name\": \"" + user.firstName + " " + user.lastName + "\",\n" +
                        "    \"role\": \"" + user.role + "\"\n" +
                        "  }\n" +
                        "}";
                sendJsonResponse(exchange, response);
            } else {
                String response = "{\n" +
                        "  \"valid\": false,\n" +
                        "  \"message\": \"Invalid or expired token\"\n" +
                        "}";
                sendJsonResponse(exchange, response, 401);
            }
        }
    }
    
    static class LogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Get authorization header
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                activeTokens.remove(token);
            }
            
            String response = "{\n" +
                    "  \"message\": \"Logout successful\",\n" +
                    "  \"success\": true\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class ProductsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "[\n" +
                    "  {\n" +
                    "    \"id\": 1,\n" +
                    "    \"name\": \"Paracétamol 500mg\",\n" +
                    "    \"description\": \"Analgésique et antipyrétique\",\n" +
                    "    \"price\": 8.50,\n" +
                    "    \"stock\": 250,\n" +
                    "    \"category\": \"Analgésiques\",\n" +
                    "    \"expiry\": \"2025-12-31\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 2,\n" +
                    "    \"name\": \"Ibuprofène 200mg\",\n" +
                    "    \"description\": \"Anti-inflammatoire non stéroïdien\",\n" +
                    "    \"price\": 10.20,\n" +
                    "    \"stock\": 180,\n" +
                    "    \"category\": \"Anti-inflammatoires\",\n" +
                    "    \"expiry\": \"2025-10-15\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 3,\n" +
                    "    \"name\": \"Amoxicilline 500mg\",\n" +
                    "    \"description\": \"Antibiotique de la famille des bêta-lactamines\",\n" +
                    "    \"price\": 15.75,\n" +
                    "    \"stock\": 120,\n" +
                    "    \"category\": \"Antibiotiques\",\n" +
                    "    \"expiry\": \"2024-08-20\"\n" +
                    "  }\n" +
                    "]";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class ClientsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "[\n" +
                    "  {\n" +
                    "    \"id\": 1,\n" +
                    "    \"name\": \"Sophie Dubois\",\n" +
                    "    \"email\": \"sophie.dubois@example.com\",\n" +
                    "    \"phone\": \"0612345678\",\n" +
                    "    \"birthDate\": \"1985-06-15\",\n" +
                    "    \"lastVisit\": \"2023-04-10\",\n" +
                    "    \"status\": \"régulier\",\n" +
                    "    \"hasPrescription\": true\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 2,\n" +
                    "    \"name\": \"Jean Martin\",\n" +
                    "    \"email\": \"jean.martin@example.com\",\n" +
                    "    \"phone\": \"0723456789\",\n" +
                    "    \"birthDate\": \"1972-03-22\",\n" +
                    "    \"lastVisit\": \"2023-03-28\",\n" +
                    "    \"status\": \"nouveau\",\n" +
                    "    \"hasPrescription\": false\n" +
                    "  }\n" +
                    "]";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class PermissionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "[\n" +
                    "  {\n" +
                    "    \"id\": 1,\n" +
                    "    \"name\": \"VIEW_CLIENTS\",\n" +
                    "    \"description\": \"Voir la liste des clients\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 2,\n" +
                    "    \"name\": \"EDIT_CLIENTS\",\n" +
                    "    \"description\": \"Modifier les informations des clients\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 3,\n" +
                    "    \"name\": \"VIEW_INVENTORY\",\n" +
                    "    \"description\": \"Voir l'inventaire des produits\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 4,\n" +
                    "    \"name\": \"EDIT_INVENTORY\",\n" +
                    "    \"description\": \"Modifier l'inventaire des produits\"\n" +
                    "  }\n" +
                    "]";
            
            sendJsonResponse(exchange, response);
        }
    }
} 