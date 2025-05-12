package com.pharmaflow.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/dashboard")
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
            analytics.put("topProducts", List.of(
                Map.of("name", "Product A", "sales", 150),
                Map.of("name", "Product B", "sales", 120),
                Map.of("name", "Product C", "sales", 90)
            ));
            response.put("analytics", analytics);

            // Settings data
            Map<String, Object> settings = new HashMap<>();
            settings.put("notifications", Map.of(
                "email", true,
                "push", true,
                "sms", false
            ));
            settings.put("security", Map.of(
                "twoFactor", true,
                "sessionTimeout", 30
            ));
            settings.put("users", Map.of(
                "total", 15,
                "active", 12,
                "roles", List.of(
                    Map.of("name", "Admin", "count", 2),
                    Map.of("name", "Pharmacist", "count", 5),
                    Map.of("name", "Staff", "count", 8)
                )
            ));
            settings.put("system", Map.of(
                "version", "1.0.0",
                "lastBackup", now.minusDays(1).toString(),
                "storage", Map.of(
                    "used", 25,
                    "total", 100
                )
            ));
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
                prescription.put("patient", Map.of(
                    "name", "Patient " + (i + 1),
                    "avatar", null
                ));
                prescription.put("doctor", "Dr. Smith");
                prescription.put("date", now.minusDays(i).toString());
                prescription.put("status", i % 3 == 0 ? "completed" : i % 3 == 1 ? "pending" : "cancelled");
                prescription.put("medications", List.of(
                    Map.of("name", "Medication A", "quantity", 2),
                    Map.of("name", "Medication B", "quantity", 1)
                ));
                recentPrescriptions.add(prescription);
            }
            prescriptions.put("recent", recentPrescriptions);
            response.put("prescriptions", prescriptions);
        }

        return ResponseEntity.ok(response);
    }
} 