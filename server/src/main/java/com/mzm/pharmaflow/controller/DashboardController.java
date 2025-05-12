package com.mzm.pharmaflow.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DashboardController {

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestParam String role,
            @RequestParam(required = false) String period) {
        
        Map<String, Object> response = new HashMap<>();
        
        // Stats
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", 1248);
        stats.put("lowStockProducts", 42);
        stats.put("totalClients", 842);
        stats.put("recentSales", 128);
        stats.put("pendingOrders", 15);
        stats.put("alerts", 7);
        response.put("stats", stats);

        // Sales Chart Data
        List<Map<String, Object>> salesChart = new ArrayList<>();
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        
        for (int i = 6; i >= 0; i--) {
            Map<String, Object> dataPoint = new HashMap<>();
            LocalDate date = now.minusMonths(i);
            dataPoint.put("date", date.format(formatter));
            dataPoint.put("value", (int)(Math.random() * 1000) + 500);
            salesChart.add(dataPoint);
        }
        response.put("salesChart", salesChart);

        // Recent Sales
        List<Map<String, Object>> recentSales = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Map<String, Object> sale = new HashMap<>();
            sale.put("id", "S" + (1000 + i));
            sale.put("client", "Client " + (i + 1));
            sale.put("amount", (i + 1) * 100.0);
            sale.put("date", now.minusDays(i).toString());
            recentSales.add(sale);
        }
        response.put("recentSales", recentSales);
        response.put("recentSalesCount", recentSales.size());

        // Role-specific data
        if ("admin".equals(role)) {
            // Analytics data
            Map<String, Object> analytics = new HashMap<>();
            analytics.put("totalRevenue", 125000);
            analytics.put("revenueChange", 12.5);
            
            List<Map<String, Object>> topProducts = new ArrayList<>();
            Map<String, Object> product1 = new HashMap<>();
            product1.put("name", "Product A");
            product1.put("sales", 150);
            topProducts.add(product1);
            
            Map<String, Object> product2 = new HashMap<>();
            product2.put("name", "Product B");
            product2.put("sales", 120);
            topProducts.add(product2);
            
            Map<String, Object> product3 = new HashMap<>();
            product3.put("name", "Product C");
            product3.put("sales", 90);
            topProducts.add(product3);
            
            analytics.put("topProducts", topProducts);
            response.put("analytics", analytics);

            // Settings data
            Map<String, Object> settings = new HashMap<>();
            
            Map<String, Object> notifications = new HashMap<>();
            notifications.put("email", true);
            notifications.put("push", true);
            notifications.put("sms", false);
            settings.put("notifications", notifications);
            
            Map<String, Object> security = new HashMap<>();
            security.put("twoFactor", true);
            security.put("sessionTimeout", 30);
            settings.put("security", security);
            
            Map<String, Object> users = new HashMap<>();
            users.put("total", 15);
            users.put("active", 12);
            
            List<Map<String, Object>> roles = new ArrayList<>();
            Map<String, Object> adminRole = new HashMap<>();
            adminRole.put("name", "Admin");
            adminRole.put("count", 2);
            roles.add(adminRole);
            
            Map<String, Object> pharmacistRole = new HashMap<>();
            pharmacistRole.put("name", "Pharmacist");
            pharmacistRole.put("count", 5);
            roles.add(pharmacistRole);
            
            Map<String, Object> staffRole = new HashMap<>();
            staffRole.put("name", "Staff");
            staffRole.put("count", 8);
            roles.add(staffRole);
            
            users.put("roles", roles);
            settings.put("users", users);
            
            Map<String, Object> system = new HashMap<>();
            system.put("version", "1.0.0");
            system.put("lastBackup", now.minusDays(1).toString());
            
            Map<String, Object> storage = new HashMap<>();
            storage.put("used", 25);
            storage.put("total", 100);
            system.put("storage", storage);
            
            settings.put("system", system);
            response.put("settings", settings);
        }

        if ("pharmacist".equals(role)) {
            // Prescriptions data
            Map<String, Object> prescriptions = new HashMap<>();
            prescriptions.put("total", 45);
            prescriptions.put("pending", 12);
            prescriptions.put("completed", 33);
            
            List<Map<String, Object>> recentPrescriptions = new ArrayList<>();
            for (int i = 0; i < 5; i++) {
                Map<String, Object> prescription = new HashMap<>();
                prescription.put("id", "P" + (1000 + i));
                
                Map<String, Object> patient = new HashMap<>();
                patient.put("name", "Patient " + (i + 1));
                patient.put("avatar", null);
                prescription.put("patient", patient);
                
                prescription.put("doctor", "Dr. Smith");
                prescription.put("date", now.minusDays(i).toString());
                prescription.put("status", i % 3 == 0 ? "completed" : i % 3 == 1 ? "pending" : "cancelled");
                
                List<Map<String, Object>> medications = new ArrayList<>();
                Map<String, Object> med1 = new HashMap<>();
                med1.put("name", "Medication A");
                med1.put("quantity", 2);
                medications.add(med1);
                
                Map<String, Object> med2 = new HashMap<>();
                med2.put("name", "Medication B");
                med2.put("quantity", 1);
                medications.add(med2);
                
                prescription.put("medications", medications);
                recentPrescriptions.add(prescription);
            }
            prescriptions.put("recent", recentPrescriptions);
            response.put("prescriptions", prescriptions);
        }

        return ResponseEntity.ok(response);
    }
} 