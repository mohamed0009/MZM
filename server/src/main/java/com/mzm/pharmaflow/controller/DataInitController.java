package com.mzm.pharmaflow.controller;

import com.mzm.pharmaflow.dto.ClientDTO;
import com.mzm.pharmaflow.dto.ProductDTO;
import com.mzm.pharmaflow.dto.ResponseDTO;
import com.mzm.pharmaflow.model.ClientStatus;
import com.mzm.pharmaflow.model.ProductCategory;
import com.mzm.pharmaflow.service.ClientService;
import com.mzm.pharmaflow.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/data")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DataInitController {

    private final ProductService productService;
    private final ClientService clientService;
    private final JdbcTemplate jdbcTemplate;
    private final Random random = new Random();

    @Autowired
    public DataInitController(ProductService productService, ClientService clientService, JdbcTemplate jdbcTemplate) {
        this.productService = productService;
        this.clientService = clientService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/init-products")
    public ResponseEntity<ResponseDTO> initializeProducts(@RequestParam(defaultValue = "20") int count) {
        List<ProductDTO> products = generateSampleProducts(count);
        int savedCount = 0;

        for (ProductDTO product : products) {
            try {
                productService.save(product);
                savedCount++;
            } catch (Exception e) {
                // Continue with next product if one fails
                System.out.println("Failed to save product: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(new ResponseDTO(true, "Successfully created " + savedCount + " products"));
    }

    @PostMapping("/init-clients")
    public ResponseEntity<ResponseDTO> initializeClients(@RequestParam(defaultValue = "15") int count) {
        List<ClientDTO> clients = generateSampleClients(count);
        int savedCount = 0;

        for (ClientDTO client : clients) {
            try {
                clientService.save(client);
                savedCount++;
            } catch (Exception e) {
                // Continue with next client if one fails
                System.out.println("Failed to save client: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(new ResponseDTO(true, "Successfully created " + savedCount + " clients"));
    }

    @PostMapping("/init-all")
    public ResponseEntity<ResponseDTO> initializeAll() {
        initializeProducts(30);
        initializeClients(20);
        return ResponseEntity.ok(new ResponseDTO(true, "Data initialization completed"));
    }
    
    @PostMapping("/init-sample-data")
    public ResponseEntity<ResponseDTO> initializeSampleData() {
        try {
            // Add 10 products
            jdbcTemplate.execute("INSERT INTO products (name, code, description, category, quantity, threshold, price, expiry_date, manufacturer, needs_prescription, created_at) VALUES " +
                    "('Paracétamol 500mg', 'MED1001', 'Analgésique et antipyrétique', 'ANALGESIQUE', 250, 50, 8.50, '2025-12-31', 'Sanofi', FALSE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO products (name, code, description, category, quantity, threshold, price, expiry_date, manufacturer, needs_prescription, created_at) VALUES " +
                    "('Ibuprofène 200mg', 'MED1002', 'Anti-inflammatoire non stéroïdien', 'ANTIINFLAMMATOIRE', 180, 40, 10.20, '2025-10-15', 'Pfizer', FALSE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO products (name, code, description, category, quantity, threshold, price, expiry_date, manufacturer, needs_prescription, created_at) VALUES " +
                    "('Amoxicilline 500mg', 'MED1003', 'Antibiotique de la famille des bêta-lactamines', 'ANTIBIOTIQUE', 120, 30, 15.75, '2024-08-20', 'Novartis', TRUE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO products (name, code, description, category, quantity, threshold, price, expiry_date, manufacturer, needs_prescription, created_at) VALUES " +
                    "('Doliprane 1000mg', 'MED1004', 'Paracétamol en comprimés', 'ANALGESIQUE', 300, 60, 7.25, '2025-09-15', 'Sanofi', FALSE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO products (name, code, description, category, quantity, threshold, price, expiry_date, manufacturer, needs_prescription, created_at) VALUES " +
                    "('Ventoline', 'MED1005', 'Bronchodilatateur pour asthme', 'RESPIRATOIRE', 80, 20, 19.99, '2026-01-10', 'GlaxoSmithKline', TRUE, CURRENT_DATE())");
            
            // Add 5 clients
            jdbcTemplate.execute("INSERT INTO clients (first_name, last_name, email, phone, address, medical_history, status, birth_date, has_prescription, created_at) VALUES " +
                    "('Sophie', 'Dubois', 'sophie.dubois@example.com', '0612345678', '123 Rue Principale, Casablanca', 'Patient depuis 2018. Allergie aux pénicillines.', 'REGULIER', '1985-06-15', TRUE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO clients (first_name, last_name, email, phone, address, medical_history, status, birth_date, has_prescription, created_at) VALUES " +
                    "('Mohammed', 'Alami', 'mohammed.alami@example.com', '0623456789', '45 Avenue Hassan II, Rabat', 'Patient depuis 2019. Diabète type 2.', 'NOUVEAU', '1972-03-22', FALSE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO clients (first_name, last_name, email, phone, address, medical_history, status, birth_date, has_prescription, created_at) VALUES " +
                    "('Fatima', 'Benani', 'fatima.benani@example.com', '0634567890', '78 Rue des Écoles, Marrakech', 'Patiente depuis 2017. Hypertension artérielle.', 'REGULIER', '1968-11-05', TRUE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO clients (first_name, last_name, email, phone, address, medical_history, status, birth_date, has_prescription, created_at) VALUES " +
                    "('Omar', 'Chraibi', 'omar.chraibi@example.com', '0645678901', '12 Boulevard Mohammed V, Tanger', 'Patient depuis 2020. Asthmatique.', 'NOUVEAU', '1990-08-12', TRUE, CURRENT_DATE())");
            jdbcTemplate.execute("INSERT INTO clients (first_name, last_name, email, phone, address, medical_history, status, birth_date, has_prescription, created_at) VALUES " +
                    "('Amina', 'Tazi', 'amina.tazi@example.com', '0656789012', '34 Rue Ibn Sina, Fès', 'Patiente depuis 2015. Allergie à aspirine.', 'REGULIER', '1982-04-25', FALSE, CURRENT_DATE())");
            
            // Add roles if they don't exist
            jdbcTemplate.execute("INSERT INTO roles (name) SELECT 'ROLE_ADMIN' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN')");
            jdbcTemplate.execute("INSERT INTO roles (name) SELECT 'ROLE_USER' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_USER')");
            jdbcTemplate.execute("INSERT INTO roles (name) SELECT 'ROLE_PHARMACIST' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_PHARMACIST')");
            jdbcTemplate.execute("INSERT INTO roles (name) SELECT 'ROLE_TECHNICIAN' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_TECHNICIAN')");
            
            // Add default admin user if not exists
            jdbcTemplate.execute("INSERT INTO users (username, email, password) " +
                    "SELECT 'admin', 'admin@pharmaflow.com', '$2a$10$qS3SkrZLkK0U/bYT.w2IceCrY4PnjIrpAw/Y0KjmH4WV7BkBp.FDu' " +
                    "WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')");
            
            // Link admin user to admin role
            jdbcTemplate.execute("INSERT INTO user_roles (user_id, role_id) " +
                    "SELECT u.id, r.id FROM users u, roles r " +
                    "WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN' " +
                    "AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id)");
            
            return ResponseEntity.ok(new ResponseDTO(true, "Sample data initialized successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ResponseDTO(false, "Error initializing data: " + e.getMessage()));
        }
    }

    private List<ProductDTO> generateSampleProducts(int count) {
        List<ProductDTO> products = new ArrayList<>();
        
        String[] medicationNames = {
            "Paracétamol", "Ibuprofène", "Aspirine", "Amoxicilline", "Doliprane", 
            "Advil", "Spasfon", "Smecta", "Augmentin", "Efferalgan", 
            "Voltarène", "Forlax", "Kardégic", "Xanax", "Ventoline", 
            "Levothyrox", "Tahor", "Doliprane", "Dafalgan", "Spasfon",
            "Gaviscon", "Daflon", "Aerius", "Toplexil", "Nurofen",
            "Ixprim", "Lamaline", "Lexomil", "Mopral", "Vicks",
            "Strepsils", "Rhinofluimucil", "Biseptine", "Imodium", "Zyrtec"
        };
        
        String[] manufacturers = {
            "Sanofi", "Pfizer", "Roche", "Novartis", "Merck", 
            "GlaxoSmithKline", "Johnson & Johnson", "AstraZeneca",
            "Bayer", "Eli Lilly", "Bristol-Myers Squibb", "Abbott",
            "Boehringer Ingelheim", "Amgen", "Takeda"
        };
        
        ProductCategory[] categories = ProductCategory.values();

        for (int i = 0; i < count; i++) {
            ProductDTO product = new ProductDTO();
            
            String name = medicationNames[random.nextInt(medicationNames.length)];
            // Add some variation to avoid duplicate names
            if (i >= medicationNames.length) {
                name += " " + (random.nextInt(500) + 100) + "mg";
            }
            
            product.setName(name);
            product.setCode("MED" + (1000 + i));
            product.setDescription("Description for " + name);
            product.setPrice(new java.math.BigDecimal(5.0 + (random.nextDouble() * 195.0))); // Price between 5 and 200
            product.setQuantity(10 + random.nextInt(100)); // Quantity between 10 and 110
            
            // Set expiry date between 1 month and 3 years from now
            int daysToAdd = 30 + random.nextInt(365 * 3);
            product.setExpiryDate(LocalDate.now().plusDays(daysToAdd));
            
            ProductCategory category = categories[random.nextInt(categories.length)];
            product.setCategory(category.name());
            product.setManufacturer(manufacturers[random.nextInt(manufacturers.length)]);
            product.setPrescriptionRequired(random.nextBoolean());
            
            products.add(product);
        }
        
        return products;
    }

    private List<ClientDTO> generateSampleClients(int count) {
        List<ClientDTO> clients = new ArrayList<>();
        
        String[] firstNames = {
            "Mohammed", "Ahmed", "Fatima", "Aisha", "Omar", 
            "Youssef", "Amina", "Sara", "Karim", "Nadia",
            "Rachid", "Latifa", "Meryem", "Hassan", "Samira"
        };
        
        String[] lastNames = {
            "Alami", "Benani", "Tazi", "Benjelloun", "Chraibi", 
            "El Fassi", "Idrissi", "Lahlou", "Mansouri", "Ouazzani",
            "Sebti", "Tahiri", "Chaoui", "Bennani", "Ziani"
        };
        
        ClientStatus[] statuses = ClientStatus.values();

        for (int i = 0; i < count; i++) {
            ClientDTO client = new ClientDTO();
            
            String firstName = firstNames[random.nextInt(firstNames.length)];
            String lastName = lastNames[random.nextInt(lastNames.length)];
            
            client.setFirstName(firstName);
            client.setLastName(lastName);
            client.setEmail(firstName.toLowerCase() + "." + lastName.toLowerCase() + "@example.com");
            client.setPhone("+212" + (600000000 + random.nextInt(99999999)));
            client.setAddress((random.nextInt(300) + 1) + " Rue " + (random.nextInt(100) + 1) + ", Casablanca");
            client.setMedicalHistory("Patient depuis " + (2010 + random.nextInt(13)) + ". " + 
                                    (random.nextBoolean() ? "Allergie aux pénicillines. " : "") +
                                    (random.nextBoolean() ? "Tension artérielle élevée. " : "") +
                                    (random.nextBoolean() ? "Diabète de type 2. " : ""));
            ClientStatus status = statuses[random.nextInt(statuses.length)];
            client.setStatus(status.name());
            
            clients.add(client);
        }
        
        return clients;
    }
} 