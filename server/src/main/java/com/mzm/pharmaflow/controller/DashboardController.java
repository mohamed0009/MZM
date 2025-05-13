package com.mzm.pharmaflow.controller;

import com.mzm.pharmaflow.dto.ResponseDTO;
import com.mzm.pharmaflow.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Get dashboard data based on user role
     * @param role user role (admin, pharmacist, technician)
     * @return dashboard data
     */
    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam(required = false) String role) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Stats section
            Map<String, Object> stats = dashboardService.getStats();
            response.put("stats", stats);

            // Sales chart data
            Map<String, Object> salesChart = dashboardService.getSalesChartData();
            response.put("salesChart", salesChart);

            // Recent sales
            List<Map<String, Object>> recentSales = dashboardService.getRecentSales();
            response.put("recentSales", recentSales);
            response.put("recentSalesCount", recentSales.size());

            // Alerts
            List<Map<String, Object>> alerts = dashboardService.getAlerts();
            response.put("alerts", alerts);

            // Inventory
            List<Map<String, Object>> inventory = dashboardService.getInventory();
            response.put("inventory", inventory);

            // Clients
            List<Map<String, Object>> clients = dashboardService.getClients();
            response.put("clients", clients);

            // Calendar events
            List<Map<String, Object>> calendar = dashboardService.getCalendarEvents();
            response.put("calendar", calendar);

            // Role-specific data
            if ("admin".equals(role)) {
                // Analytics data for admin
                List<Map<String, Object>> analytics = dashboardService.getAnalyticsData();
                response.put("analytics", analytics);

                // Settings data
                Map<String, Object> settings = dashboardService.getSettingsData();
                response.put("settings", settings);
            }

            if ("pharmacist".equals(role)) {
                // Prescriptions data for pharmacist
                Map<String, Object> prescriptions = dashboardService.getPrescriptionsData();
                response.put("prescriptions", prescriptions);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get dashboard stats
     * @return dashboard stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = dashboardService.getStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 