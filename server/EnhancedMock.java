import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
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
        HttpServer server = HttpServer.create(new InetSocketAddress(8081), 0);
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
        server.createContext("/api/clients", new ClientsHandler());
        server.createContext("/api/clients/update", new PermissionRestrictedHandler(new ClientUpdateHandler(), "EDIT_CLIENTS"));
        server.createContext("/api/permissions/all", new PermissionRestrictedHandler(new PermissionsHandler(), "VIEW_INVENTORY"));
        server.createContext("/api/system/users", new PermissionRestrictedHandler(new UsersHandler(), "MANAGE_USERS"));
        
        // Add orders endpoint
        server.createContext("/api/test/orders", new OrdersHandler());
        
        // Add data viewer endpoint
        server.createContext("/api/data-viewer", new DataViewerHandler());
        
        // Add sales endpoint
        server.createContext("/api/sales", new SalesHandler());
        server.createContext("/api/sales/stats", new SalesStatsHandler());
        
        // Add data initialization endpoint
        server.createContext("/api/data/init-sample-data", new DataInitHandler());
        
        // Add dashboard data endpoint
        server.createContext("/api/dashboard/data", new DashboardDataHandler());
        
        // Start server
        server.start();
        
        System.out.println("=======================================================");
        System.out.println("         Enhanced Mock Backend Server Started");
        System.out.println("         API available at: http://localhost:8081/api");
        System.out.println("         Test API: http://localhost:8081/api/test/echo");
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
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 3,\n" +
                    "    \"name\": \"Mohammed Alami\",\n" +
                    "    \"email\": \"m.alami@example.com\",\n" +
                    "    \"phone\": \"0661234567\",\n" +
                    "    \"birthDate\": \"1988-11-05\",\n" +
                    "    \"lastVisit\": \"2023-05-12\",\n" +
                    "    \"status\": \"régulier\",\n" +
                    "    \"hasPrescription\": true\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 4,\n" +
                    "    \"name\": \"Fatima Benali\",\n" +
                    "    \"email\": \"f.benali@example.com\",\n" +
                    "    \"phone\": \"0754321987\",\n" +
                    "    \"birthDate\": \"1990-08-17\",\n" +
                    "    \"lastVisit\": \"2023-05-14\",\n" +
                    "    \"status\": \"régulier\",\n" +
                    "    \"hasPrescription\": true\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 5,\n" +
                    "    \"name\": \"Ahmed Laroussi\",\n" +
                    "    \"email\": \"a.laroussi@example.com\",\n" +
                    "    \"phone\": \"0634567890\",\n" +
                    "    \"birthDate\": \"1965-02-28\",\n" +
                    "    \"lastVisit\": \"2023-05-01\",\n" +
                    "    \"status\": \"régulier\",\n" +
                    "    \"hasPrescription\": true\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 6,\n" +
                    "    \"name\": \"Yasmine Kadiri\",\n" +
                    "    \"email\": \"y.kadiri@example.com\",\n" +
                    "    \"phone\": \"0698765432\",\n" +
                    "    \"birthDate\": \"1992-04-09\",\n" +
                    "    \"lastVisit\": \"2023-05-08\",\n" +
                    "    \"status\": \"nouveau\",\n" +
                    "    \"hasPrescription\": false\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 7,\n" +
                    "    \"name\": \"Karim Mansouri\",\n" +
                    "    \"email\": \"k.mansouri@example.com\",\n" +
                    "    \"phone\": \"0678901234\",\n" +
                    "    \"birthDate\": \"1979-12-15\",\n" +
                    "    \"lastVisit\": \"2023-05-11\",\n" +
                    "    \"status\": \"régulier\",\n" +
                    "    \"hasPrescription\": true\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 8,\n" +
                    "    \"name\": \"Sara Benjelloun\",\n" +
                    "    \"email\": \"s.benjelloun@example.com\",\n" +
                    "    \"phone\": \"0712345678\",\n" +
                    "    \"birthDate\": \"1987-07-22\",\n" +
                    "    \"lastVisit\": \"2023-05-13\",\n" +
                    "    \"status\": \"régulier\",\n" +
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
    
    // Orders Handler for test/orders endpoint
    static class OrdersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            addCorsHeaders(exchange);
            
            // Handle preflight
            if (handlePreflight(exchange)) {
                return;
            }
            
            if ("GET".equals(exchange.getRequestMethod())) {
                // Create sample orders data
                List<Map<String, Object>> orders = new ArrayList<>();
                
                // Order 1
                Map<String, Object> order1 = new HashMap<>();
                order1.put("id", "ORD-2023-5678");
                order1.put("supplier", "MedPharm Supplies");
                order1.put("date", "2023-06-15");
                order1.put("status", "En attente");
                order1.put("total", 2580.50);
                order1.put("paymentStatus", "Payé");
                
                List<Map<String, Object>> items1 = new ArrayList<>();
                Map<String, Object> item1 = new HashMap<>();
                item1.put("id", 1);
                item1.put("name", "Paracétamol 500mg");
                item1.put("quantity", 50);
                item1.put("price", 8.50);
                item1.put("total", 425.0);
                items1.add(item1);
                
                Map<String, Object> item2 = new HashMap<>();
                item2.put("id", 2);
                item2.put("name", "Amoxicilline 1g");
                item2.put("quantity", 30);
                item2.put("price", 15.20);
                item2.put("total", 456.0);
                items1.add(item2);
                
                Map<String, Object> item3 = new HashMap<>();
                item3.put("id", 3);
                item3.put("name", "Gants médicaux (boîte)");
                item3.put("quantity", 20);
                item3.put("price", 12.50);
                item3.put("total", 250.0);
                items1.add(item3);
                
                order1.put("items", items1);
                orders.add(order1);
                
                // Order 2
                Map<String, Object> order2 = new HashMap<>();
                order2.put("id", "ORD-2023-5679");
                order2.put("supplier", "PharmaSolutions");
                order2.put("date", "2023-06-14");
                order2.put("status", "Expédiée");
                order2.put("total", 1890.75);
                order2.put("paymentStatus", "Payé");
                
                List<Map<String, Object>> items2 = new ArrayList<>();
                Map<String, Object> item21 = new HashMap<>();
                item21.put("id", 1);
                item21.put("name", "Alcool médical 70% 1L");
                item21.put("quantity", 30);
                item21.put("price", 5.20);
                item21.put("total", 156.0);
                items2.add(item21);
                
                Map<String, Object> item22 = new HashMap<>();
                item22.put("id", 2);
                item22.put("name", "Seringues 10ml (paquet)");
                item22.put("quantity", 50);
                item22.put("price", 8.75);
                item22.put("total", 437.50);
                items2.add(item22);
                
                order2.put("items", items2);
                orders.add(order2);
                
                // Convert to JSON and send response
                String jsonString = orders.toString()
                    .replace("=", ":")
                    .replace("{", "{\"")
                    .replace("}", "\"}")
                    .replace(", ", ", \"")
                    .replace(":{", ":{\"")
                    .replace(":\"[", ":[")
                    .replace("]\"", "]")
                    .replace("}\", ", "}, ")
                    .replace("\"{", "{")
                    .replace("}\"", "}");
                    
                sendJsonResponse(exchange, jsonString);
            } else {
                // Method not allowed
                exchange.sendResponseHeaders(405, 0);
                exchange.getResponseBody().close();
            }
        }
    }
    
    // Data Viewer Handler - displays all data in a simple HTML format
    static class DataViewerHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            addCorsHeaders(exchange);
            
            // Handle preflight
            if (handlePreflight(exchange)) {
                return;
            }
            
            if ("GET".equals(exchange.getRequestMethod())) {
                StringBuilder htmlBuilder = new StringBuilder();
                htmlBuilder.append("<!DOCTYPE html>");
                htmlBuilder.append("<html>");
                htmlBuilder.append("<head>");
                htmlBuilder.append("<title>PharmaFlow Data Viewer</title>");
                htmlBuilder.append("<style>");
                htmlBuilder.append("body { font-family: Arial, sans-serif; margin: 20px; }");
                htmlBuilder.append("h1 { color: #2c3e50; }");
                htmlBuilder.append("h2 { color: #3498db; margin-top: 30px; }");
                htmlBuilder.append("table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }");
                htmlBuilder.append("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
                htmlBuilder.append("th { background-color: #f2f2f2; }");
                htmlBuilder.append("tr:nth-child(even) { background-color: #f9f9f9; }");
                htmlBuilder.append("</style>");
                htmlBuilder.append("</head>");
                htmlBuilder.append("<body>");
                htmlBuilder.append("<h1>PharmaFlow Data Viewer</h1>");
                
                // Users Table
                htmlBuilder.append("<h2>Users Table</h2>");
                htmlBuilder.append("<table>");
                htmlBuilder.append("<tr><th>ID</th><th>Username</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Role</th></tr>");
                
                for (User user : users.values()) {
                    htmlBuilder.append("<tr>");
                    htmlBuilder.append("<td>").append(user.id).append("</td>");
                    htmlBuilder.append("<td>").append(user.username).append("</td>");
                    htmlBuilder.append("<td>").append(user.email).append("</td>");
                    htmlBuilder.append("<td>").append(user.firstName).append("</td>");
                    htmlBuilder.append("<td>").append(user.lastName).append("</td>");
                    htmlBuilder.append("<td>").append(user.role).append("</td>");
                    htmlBuilder.append("</tr>");
                }
                
                htmlBuilder.append("</table>");
                
                // Sessions Table
                htmlBuilder.append("<h2>Active Sessions Table</h2>");
                htmlBuilder.append("<table>");
                htmlBuilder.append("<tr><th>Session ID</th><th>User ID</th><th>Role</th><th>Created At</th><th>Expires At</th><th>IP Address</th><th>Active</th></tr>");
                
                for (Session session : activeSessions.values()) {
                    htmlBuilder.append("<tr>");
                    htmlBuilder.append("<td>").append(session.sessionId).append("</td>");
                    htmlBuilder.append("<td>").append(session.userId).append("</td>");
                    htmlBuilder.append("<td>").append(session.role).append("</td>");
                    htmlBuilder.append("<td>").append(session.createdAt).append("</td>");
                    htmlBuilder.append("<td>").append(session.expiresAt).append("</td>");
                    htmlBuilder.append("<td>").append(session.ipAddress).append("</td>");
                    htmlBuilder.append("<td>").append(session.active).append("</td>");
                    htmlBuilder.append("</tr>");
                }
                
                htmlBuilder.append("</table>");
                
                // Roles and Permissions
                htmlBuilder.append("<h2>Role Permissions Table</h2>");
                htmlBuilder.append("<table>");
                htmlBuilder.append("<tr><th>Role</th><th>Permissions</th></tr>");
                
                for (Map.Entry<String, List<String>> entry : rolePermissions.entrySet()) {
                    htmlBuilder.append("<tr>");
                    htmlBuilder.append("<td>").append(entry.getKey()).append("</td>");
                    htmlBuilder.append("<td>").append(String.join(", ", entry.getValue())).append("</td>");
                    htmlBuilder.append("</tr>");
                }
                
                htmlBuilder.append("</table>");
                
                // Products Table (from ProductsHandler)
                htmlBuilder.append("<h2>Products Table</h2>");
                htmlBuilder.append("<table>");
                htmlBuilder.append("<tr><th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Stock</th><th>Category</th><th>Expiry</th></tr>");
                
                // Manually add products since they're defined in ProductsHandler
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>1</td>");
                htmlBuilder.append("<td>Paracétamol 500mg</td>");
                htmlBuilder.append("<td>Analgésique et antipyrétique</td>");
                htmlBuilder.append("<td>8.50</td>");
                htmlBuilder.append("<td>250</td>");
                htmlBuilder.append("<td>Analgésiques</td>");
                htmlBuilder.append("<td>2025-12-31</td>");
                htmlBuilder.append("</tr>");
                
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>2</td>");
                htmlBuilder.append("<td>Ibuprofène 200mg</td>");
                htmlBuilder.append("<td>Anti-inflammatoire non stéroïdien</td>");
                htmlBuilder.append("<td>10.20</td>");
                htmlBuilder.append("<td>180</td>");
                htmlBuilder.append("<td>Anti-inflammatoires</td>");
                htmlBuilder.append("<td>2025-10-15</td>");
                htmlBuilder.append("</tr>");
                
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>3</td>");
                htmlBuilder.append("<td>Amoxicilline 500mg</td>");
                htmlBuilder.append("<td>Antibiotique de la famille des bêta-lactamines</td>");
                htmlBuilder.append("<td>15.75</td>");
                htmlBuilder.append("<td>120</td>");
                htmlBuilder.append("<td>Antibiotiques</td>");
                htmlBuilder.append("<td>2024-08-20</td>");
                htmlBuilder.append("</tr>");
                
                htmlBuilder.append("</table>");
                
                // Orders Table
                htmlBuilder.append("<h2>Orders Table</h2>");
                htmlBuilder.append("<table>");
                htmlBuilder.append("<tr><th>ID</th><th>Supplier</th><th>Date</th><th>Status</th><th>Total</th><th>Payment Status</th></tr>");
                
                // Order 1
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>ORD-2023-5678</td>");
                htmlBuilder.append("<td>MedPharm Supplies</td>");
                htmlBuilder.append("<td>2023-06-15</td>");
                htmlBuilder.append("<td>En attente</td>");
                htmlBuilder.append("<td>2580.50</td>");
                htmlBuilder.append("<td>Payé</td>");
                htmlBuilder.append("</tr>");
                
                // Order 2
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>ORD-2023-5679</td>");
                htmlBuilder.append("<td>PharmaSolutions</td>");
                htmlBuilder.append("<td>2023-06-14</td>");
                htmlBuilder.append("<td>Expédiée</td>");
                htmlBuilder.append("<td>1890.75</td>");
                htmlBuilder.append("<td>Payé</td>");
                htmlBuilder.append("</tr>");
                
                htmlBuilder.append("</table>");
                
                // Clients Table
                htmlBuilder.append("<h2>Clients Table</h2>");
                htmlBuilder.append("<table>");
                htmlBuilder.append("<tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Birth Date</th><th>Last Visit</th><th>Status</th></tr>");
                
                // Client 1
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>1</td>");
                htmlBuilder.append("<td>Sophie Dubois</td>");
                htmlBuilder.append("<td>sophie.dubois@example.com</td>");
                htmlBuilder.append("<td>0612345678</td>");
                htmlBuilder.append("<td>1985-06-15</td>");
                htmlBuilder.append("<td>2023-04-10</td>");
                htmlBuilder.append("<td>régulier</td>");
                htmlBuilder.append("</tr>");
                
                // Client 2
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>2</td>");
                htmlBuilder.append("<td>Jean Martin</td>");
                htmlBuilder.append("<td>jean.martin@example.com</td>");
                htmlBuilder.append("<td>0723456789</td>");
                htmlBuilder.append("<td>1972-03-22</td>");
                htmlBuilder.append("<td>2023-03-28</td>");
                htmlBuilder.append("<td>nouveau</td>");
                htmlBuilder.append("</tr>");
                
                htmlBuilder.append("</table>");
                
                // Sales Table
                htmlBuilder.append("<h2>Sales Table</h2>");
                htmlBuilder.append("<table>");
                htmlBuilder.append("<tr><th>ID</th><th>Client</th><th>Date</th><th>Total</th><th>Payment Method</th></tr>");
                
                // Sale 1
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>1</td>");
                htmlBuilder.append("<td>Sophie Dubois</td>");
                htmlBuilder.append("<td>2023-05-01</td>");
                htmlBuilder.append("<td>325.00</td>");
                htmlBuilder.append("<td>CASH</td>");
                htmlBuilder.append("</tr>");
                
                // Sale 2
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>2</td>");
                htmlBuilder.append("<td>Jean Martin</td>");
                htmlBuilder.append("<td>2023-05-02</td>");
                htmlBuilder.append("<td>200.00</td>");
                htmlBuilder.append("<td>CARD</td>");
                htmlBuilder.append("</tr>");
                
                // Sale 3
                htmlBuilder.append("<tr>");
                htmlBuilder.append("<td>3</td>");
                htmlBuilder.append("<td>Youssef Mansouri</td>");
                htmlBuilder.append("<td>" + new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "</td>");
                htmlBuilder.append("<td>255.00</td>");
                htmlBuilder.append("<td>CASH</td>");
                htmlBuilder.append("</tr>");
                
                htmlBuilder.append("</table>");
                
                htmlBuilder.append("</body>");
                htmlBuilder.append("</html>");
                
                // Set response headers
                exchange.getResponseHeaders().set("Content-Type", "text/html");
                byte[] responseBytes = htmlBuilder.toString().getBytes("UTF-8");
                exchange.sendResponseHeaders(200, responseBytes.length);
                
                // Send the HTML response
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(responseBytes);
                }
            } else {
                // Method not allowed
                exchange.sendResponseHeaders(405, 0);
                exchange.getResponseBody().close();
            }
        }
    }
    
    // Sales Handler for /api/sales endpoint
    static class SalesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            addCorsHeaders(exchange);
            
            // Handle preflight
            if (handlePreflight(exchange)) {
                return;
            }
            
            if ("GET".equals(exchange.getRequestMethod())) {
                // Create sample sales data
                String salesData = "[\n" +
                    "  {\n" +
                    "    \"id\": 1,\n" +
                    "    \"clientId\": \"1\",\n" +
                    "    \"saleDate\": \"2023-05-01\",\n" +
                    "    \"items\": [\n" +
                    "      { \"productId\": \"1\", \"quantity\": 2, \"price\": 120 },\n" +
                    "      { \"productId\": \"2\", \"quantity\": 1, \"price\": 85 }\n" +
                    "    ],\n" +
                    "    \"paymentMethod\": \"CASH\",\n" +
                    "    \"notes\": \"\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 2,\n" +
                    "    \"clientId\": \"2\",\n" +
                    "    \"saleDate\": \"2023-05-02\",\n" +
                    "    \"items\": [\n" +
                    "      { \"productId\": \"3\", \"quantity\": 1, \"price\": 200 }\n" +
                    "    ],\n" +
                    "    \"paymentMethod\": \"CARD\",\n" +
                    "    \"notes\": \"\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"id\": 3,\n" +
                    "    \"clientId\": \"3\",\n" +
                    "    \"saleDate\": \"" + new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "\",\n" +
                    "    \"items\": [\n" +
                    "      { \"productId\": \"1\", \"quantity\": 1, \"price\": 120 },\n" +
                    "      { \"productId\": \"4\", \"quantity\": 3, \"price\": 45 }\n" +
                    "    ],\n" +
                    "    \"paymentMethod\": \"CASH\",\n" +
                    "    \"notes\": \"\"\n" +
                    "  }\n" +
                    "]";
                
                sendJsonResponse(exchange, salesData);
            } else if ("POST".equals(exchange.getRequestMethod())) {
                // Simulate creating a new sale
                String responseData = "{\n" +
                    "  \"success\": true,\n" +
                    "  \"message\": \"Vente créée avec succès\",\n" +
                    "  \"data\": { \"id\": " + UUID.randomUUID().toString().hashCode() + " }\n" +
                    "}";
                
                sendJsonResponse(exchange, responseData, 201);
            } else {
                // Method not allowed
                exchange.sendResponseHeaders(405, 0);
                exchange.getResponseBody().close();
            }
        }
    }
    
    // Sales Stats Handler for /api/sales/stats endpoint
    static class SalesStatsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Add CORS headers
            addCorsHeaders(exchange);
            
            // Handle preflight
            if (handlePreflight(exchange)) {
                return;
            }
            
            if ("GET".equals(exchange.getRequestMethod())) {
                // Create sample sales statistics data
                String statsData = "{\n" +
                    "  \"totalSales\": 34500,\n" +
                    "  \"salesCount\": 152,\n" +
                    "  \"todaySales\": 3850,\n" +
                    "  \"todaySalesCount\": 12,\n" +
                    "  \"averageSale\": 227,\n" +
                    "  \"mainPaymentMethod\": \"Espèces\",\n" +
                    "  \"mainPaymentMethodPercentage\": 68,\n" +
                    "  \"salesByPeriod\": [\n" +
                    "    { \"period\": \"Jan\", \"amount\": 4000 },\n" +
                    "    { \"period\": \"Fév\", \"amount\": 3000 },\n" +
                    "    { \"period\": \"Mar\", \"amount\": 5000 },\n" +
                    "    { \"period\": \"Avr\", \"amount\": 2780 },\n" +
                    "    { \"period\": \"Mai\", \"amount\": 3890 },\n" +
                    "    { \"period\": \"Jun\", \"amount\": 2390 }\n" +
                    "  ],\n" +
                    "  \"paymentMethods\": [\n" +
                    "    { \"name\": \"Espèces\", \"value\": 103 },\n" +
                    "    { \"name\": \"Carte\", \"value\": 32 },\n" +
                    "    { \"name\": \"Virement\", \"value\": 12 },\n" +
                    "    { \"name\": \"Mobile\", \"value\": 5 }\n" +
                    "  ],\n" +
                    "  \"topProducts\": [\n" +
                    "    { \"name\": \"Paracétamol 500mg\", \"quantity\": 245, \"total\": 29400, \"percentage\": 22 },\n" +
                    "    { \"name\": \"Oméprazole 20mg\", \"quantity\": 187, \"total\": 8415, \"percentage\": 16 },\n" +
                    "    { \"name\": \"Amoxicilline 1g\", \"quantity\": 145, \"total\": 12325, \"percentage\": 14 },\n" +
                    "    { \"name\": \"Ibuprofène 400mg\", \"quantity\": 98, \"total\": 19600, \"percentage\": 11 },\n" +
                    "    { \"name\": \"Doliprane 1000mg\", \"quantity\": 76, \"total\": 3990, \"percentage\": 8 }\n" +
                    "  ]\n" +
                    "}";
                
                sendJsonResponse(exchange, statsData);
            } else {
                // Method not allowed
                exchange.sendResponseHeaders(405, 0);
                exchange.getResponseBody().close();
            }
        }
    }
    
    // Data Init Handler for /api/data/init-sample-data endpoint
    static class DataInitHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Only handle POST requests
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                exchange.sendResponseHeaders(405, 0);
                exchange.close();
                return;
            }
            
            System.out.println("Initializing sample data...");
            
            // Respond with success
            String response = "{\n" +
                    "  \"success\": true,\n" +
                    "  \"message\": \"Sample data initialized successfully\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
            
            System.out.println("Sample data initialized successfully");
        }
    }
    
    // Dashboard Data Handler for /api/dashboard/data endpoint
    static class DashboardDataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            // Get the role from query parameters if available
            String query = exchange.getRequestURI().getQuery();
            String role = "admin"; // Default role
            
            if (query != null && query.contains("role=")) {
                role = query.substring(query.indexOf("role=") + 5);
                if (role.contains("&")) {
                    role = role.substring(0, role.indexOf("&"));
                }
            }
            
            // Create dashboard data based on role
            StringBuilder responseJson = new StringBuilder();
            responseJson.append("{\n");
            responseJson.append("  \"stats\": {\n");
            responseJson.append("    \"totalSales\": 8459,\n");
            responseJson.append("    \"totalOrders\": 145,\n");
            responseJson.append("    \"totalCustomers\": 72,\n");
            responseJson.append("    \"totalRevenue\": 145890,\n");
            responseJson.append("    \"totalProducts\": 728,\n");
            responseJson.append("    \"lowStockProducts\": 12,\n");
            responseJson.append("    \"totalClients\": 96,\n");
            responseJson.append("    \"recentSales\": 24,\n");
            responseJson.append("    \"pendingOrders\": 5,\n");
            responseJson.append("    \"alerts\": 8\n");
            responseJson.append("  },\n");
            responseJson.append("  \"salesChart\": {\n");
            responseJson.append("    \"labels\": [\"Jan\", \"Fév\", \"Mar\", \"Avr\", \"Mai\", \"Jun\", \"Jul\"],\n");
            responseJson.append("    \"data\": [4500, 3800, 5200, 2900, 1950, 2400, 3600]\n");
            responseJson.append("  },\n");
            responseJson.append("  \"recentSales\": [\n");
            responseJson.append("    { \"id\": \"1\", \"customer\": \"Mohammed Alami\", \"amount\": 450, \"date\": \"Il y a 3 heures\" },\n");
            responseJson.append("    { \"id\": \"2\", \"customer\": \"Fatima Benali\", \"amount\": 235, \"date\": \"Il y a 5 heures\" },\n");
            responseJson.append("    { \"id\": \"3\", \"customer\": \"Ahmed Laroussi\", \"amount\": 290, \"date\": \"Il y a 1 jour\" }\n");
            responseJson.append("  ],\n");
            responseJson.append("  \"recentSalesCount\": 3,\n");
            responseJson.append("  \"alerts\": [\n");
            responseJson.append("    { \"id\": \"1\", \"title\": \"Stock faible\", \"message\": \"12 produits en stock critique\" }\n");
            responseJson.append("  ],\n");
            responseJson.append("  \"inventory\": [\n");
            responseJson.append("    { \"id\": \"1\", \"name\": \"Paracetamol 500mg\", \"stock\": 8, \"category\": \"Analgésique\" },\n");
            responseJson.append("    { \"id\": \"2\", \"name\": \"Amoxicilline 1g\", \"stock\": 15, \"category\": \"Antibiotique\" }\n");
            responseJson.append("  ],\n");
            responseJson.append("  \"clients\": [\n");
            responseJson.append("    { \"id\": \"1\", \"name\": \"Sophie Dubois\", \"email\": \"sophie.dubois@example.com\", \"phone\": \"0612345678\" },\n");
            responseJson.append("    { \"id\": \"2\", \"name\": \"Jean Martin\", \"email\": \"jean.martin@example.com\", \"phone\": \"0723456789\" }\n");
            responseJson.append("  ],\n");
            responseJson.append("  \"calendar\": [],\n");
            responseJson.append("  \"analytics\": [],\n");
            responseJson.append("  \"settings\": {},\n");
            responseJson.append("  \"prescriptions\": {\n");
            responseJson.append("    \"total\": 28,\n");
            responseJson.append("    \"pending\": 12,\n");
            responseJson.append("    \"completed\": 16,\n");
            responseJson.append("    \"recent\": []\n");
            responseJson.append("  }\n");
            responseJson.append("}");
            
            sendJsonResponse(exchange, responseJson.toString());
        }
    }
} 