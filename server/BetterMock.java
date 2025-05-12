import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class BetterMock {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // Test and health endpoints
        server.createContext("/api/test/echo", new EchoHandler());
        server.createContext("/api/health", new HealthHandler());
        
        // Auth endpoints
        server.createContext("/api/auth/test", new AuthTestHandler());
        server.createContext("/api/auth/login", new LoginHandler());
        server.createContext("/api/auth/register", new RegisterHandler());
        
        // Inventory endpoints
        server.createContext("/api/inventory/products", new ProductsHandler());
        
        // Clients endpoints
        server.createContext("/api/clients", new ClientsHandler());
        
        // Permissions endpoints
        server.createContext("/api/permissions/all", new PermissionsHandler());
        
        // Add routes endpoint
        server.createContext("/api/routes", new HttpHandler() {
          @Override
          public void handle(HttpExchange exchange) throws IOException {
            handleCORS(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
              handlePreflight(exchange);
              return;
            }

            String response = "{\"routes\": [" +
              "{\"path\": \"/dashboard\", \"name\": \"Tableau de bord\", \"icon\": \"LayoutDashboard\", \"roles\": [\"ADMIN\", \"PHARMACIST\", \"TECHNICIAN\"]}," +
              "{\"path\": \"/inventory\", \"name\": \"Inventaire\", \"icon\": \"Pill\", \"roles\": [\"ADMIN\", \"PHARMACIST\", \"TECHNICIAN\"]}," +
              "{\"path\": \"/clients\", \"name\": \"Clients\", \"icon\": \"Users\", \"roles\": [\"ADMIN\", \"PHARMACIST\", \"TECHNICIAN\"]}," +
              "{\"path\": \"/sales\", \"name\": \"Ventes\", \"icon\": \"ShoppingCart\", \"roles\": [\"ADMIN\", \"PHARMACIST\"]}," +
              "{\"path\": \"/alerts\", \"name\": \"Alertes\", \"icon\": \"Bell\", \"roles\": [\"ADMIN\", \"PHARMACIST\"]}," +
              "{\"path\": \"/calendar\", \"name\": \"Calendrier\", \"icon\": \"Calendar\", \"roles\": [\"ADMIN\", \"PHARMACIST\", \"TECHNICIAN\"]}," +
              "{\"path\": \"/reports\", \"name\": \"Rapports\", \"icon\": \"FileText\", \"roles\": [\"ADMIN\", \"PHARMACIST\"]}," +
              "{\"path\": \"/admin\", \"name\": \"Administration\", \"icon\": \"ShieldCheck\", \"roles\": [\"ADMIN\"]}" +
              "]}";
            sendJsonResponse(exchange, response);
          }
        });
        
        // Add dashboard stats endpoint
        server.createContext("/api/dashboard/stats", new HttpHandler() {
          @Override
          public void handle(HttpExchange exchange) throws IOException {
            handleCORS(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
              handlePreflight(exchange);
              return;
            }

            String response = "{\n" +
              "  \"totalProducts\": 150,\n" +
              "  \"lowStockProducts\": 12,\n" +
              "  \"totalClients\": 250,\n" +
              "  \"recentSales\": 45,\n" +
              "  \"pendingOrders\": 8\n" +
              "}";
            sendJsonResponse(exchange, response);
          }
        });
        
        // Default API handler
        server.createContext("/api", new DefaultHandler());
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("=======================================================");
        System.out.println("         Better Backend Server Started");
        System.out.println("         API disponible sur: http://localhost:8080/api");
        System.out.println("         Test API: http://localhost:8080/api/test/echo");
        System.out.println("=======================================================");
    }
    
    // Correct way to handle CORS
    private static void addCorsHeaders(HttpExchange exchange) {
        // Accept requests from both localhost:3000 and null origin (which happens in some browsers)
        String origin = exchange.getRequestHeaders().getFirst("Origin");
        if (origin != null) {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", origin);
        } else {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        }
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        exchange.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
        exchange.getResponseHeaders().add("Access-Control-Max-Age", "3600");
    }
    
    // Handle OPTIONS preflight requests
    private static boolean handlePreflight(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);
        
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return true;
        }
        return false;
    }
    
    private static void sendJsonResponse(HttpExchange exchange, String response) throws IOException {
        addCorsHeaders(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        
        byte[] responseBytes = response.getBytes("UTF-8");
        exchange.sendResponseHeaders(200, responseBytes.length);
        
        OutputStream os = exchange.getResponseBody();
        os.write(responseBytes);
        os.close();
        exchange.close();
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
            
            String response = "{\n" +
                    "  \"message\": \"Auth endpoint is working\",\n" +
                    "  \"authenticated\": false\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"token\": \"mock-jwt-token-123456789\",\n" +
                    "  \"user\": {\n" +
                    "    \"id\": \"1\",\n" +
                    "    \"email\": \"admin@example.com\",\n" +
                    "    \"name\": \"Admin User\",\n" +
                    "    \"role\": \"admin\",\n" +
                    "    \"permissions\": [\n" +
                    "      {\n" +
                    "        \"id\": \"1\",\n" +
                    "        \"name\": \"VIEW_CLIENTS\",\n" +
                    "        \"description\": \"Voir la liste des clients\"\n" +
                    "      },\n" +
                    "      {\n" +
                    "        \"id\": \"2\",\n" +
                    "        \"name\": \"EDIT_CLIENTS\",\n" +
                    "        \"description\": \"Modifier les informations des clients\"\n" +
                    "      },\n" +
                    "      {\n" +
                    "        \"id\": \"3\",\n" +
                    "        \"name\": \"VIEW_INVENTORY\",\n" +
                    "        \"description\": \"Voir l'inventaire des produits\"\n" +
                    "      },\n" +
                    "      {\n" +
                    "        \"id\": \"4\",\n" +
                    "        \"name\": \"EDIT_INVENTORY\",\n" +
                    "        \"description\": \"Modifier l'inventaire des produits\"\n" +
                    "      }\n" +
                    "    ]\n" +
                    "  }\n" +
                    "}";
            
            sendJsonResponse(exchange, response);
        }
    }
    
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handlePreflight(exchange)) return;
            
            String response = "{\n" +
                    "  \"message\": \"User registered successfully\",\n" +
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