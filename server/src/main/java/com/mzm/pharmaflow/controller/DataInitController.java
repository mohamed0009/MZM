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
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DataInitController {

    private final ProductService productService;
    private final ClientService clientService;
    private final Random random = new Random();

    @Autowired
    public DataInitController(ProductService productService, ClientService clientService) {
        this.productService = productService;
        this.clientService = clientService;
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
            product.setPrice(5.0 + (random.nextDouble() * 195.0)); // Price between 5 and 200
            product.setQuantity(10 + random.nextInt(100)); // Quantity between 10 and 110
            
            // Set expiry date between 1 month and 3 years from now
            int daysToAdd = 30 + random.nextInt(365 * 3);
            product.setExpiryDate(LocalDate.now().plusDays(daysToAdd));
            
            product.setCategory(categories[random.nextInt(categories.length)]);
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
            client.setStatus(statuses[random.nextInt(statuses.length)]);
            
            clients.add(client);
        }
        
        return clients;
    }
} 