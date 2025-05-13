package com.mzm.pharmaflow.service;

import com.mzm.pharmaflow.repository.ClientRepository;
import com.mzm.pharmaflow.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service to provide dashboard data
 */
@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ClientRepository clientRepository;

    /**
     * Get dashboard statistics
     * @return Map containing dashboard statistics
     */
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", 1248);
        stats.put("lowStockProducts", 42);
        stats.put("totalClients", 842);
        stats.put("recentSales", 128);
        stats.put("pendingOrders", 15);
        stats.put("alerts", 7);
        stats.put("totalSales", 8459);
        stats.put("totalOrders", 145);
        stats.put("totalCustomers", 72);
        stats.put("totalRevenue", 145890);
        return stats;
    }

    /**
     * Get sales chart data
     * @return Map containing chart data with labels and values
     */
    public Map<String, Object> getSalesChartData() {
        Map<String, Object> salesChart = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();
        
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = now.minusMonths(i);
            labels.add(date.format(formatter));
            data.add((int)(Math.random() * 1000) + 500);
        }
        
        salesChart.put("labels", labels);
        salesChart.put("data", data);
        return salesChart;
    }

    /**
     * Get recent sales data
     * @return List of recent sales
     */
    public List<Map<String, Object>> getRecentSales() {
        List<Map<String, Object>> recentSales = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        String[] customers = {"Mohammed Alami", "Fatima Benali", "Ahmed Laroussi", "Nadia Tazi", "Youssef Mansouri"};
        int[] amounts = {450, 235, 290, 175, 520};
        
        for (int i = 0; i < 5; i++) {
            Map<String, Object> sale = new HashMap<>();
            sale.put("id", String.valueOf(i+1));
            sale.put("customer", customers[i]);
            sale.put("amount", amounts[i]);
            sale.put("date", "Il y a " + (i+1) + (i == 0 ? " heure" : " heures"));
            recentSales.add(sale);
        }
        
        return recentSales;
    }

    /**
     * Get alerts data
     * @return List of alerts
     */
    public List<Map<String, Object>> getAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        
        String[] titles = {
            "Stock critique - Paracétamol 500mg",
            "Stock critique - Amoxicilline 1g",
            "Stock faible - Ibuprofène 400mg",
            "Expiration proche - Insuline Lantus",
            "Expiration proche - Vaccin Antigrippal"
        };
        
        String[] descriptions = {
            "Le stock est descendu à 5 unités (seuil: 20)",
            "Le stock est descendu à 8 unités (seuil: 15)",
            "Le stock est descendu à 12 unités (seuil: 25)",
            "Expire dans 7 jours (15/05/2024)",
            "Expire dans 5 jours (10/05/2024)"
        };
        
        String[] categories = {"stock", "stock", "stock", "expiry", "expiry"};
        String[] priorities = {"high", "high", "medium", "high", "high"};
        String[] times = {"Il y a 30 minutes", "Il y a 1 heure", "Il y a 2 heures", "Il y a 45 minutes", "Il y a 1 heure"};
        boolean[] read = {false, false, false, false, true};
        
        for (int i = 0; i < titles.length; i++) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("id", i+1);
            alert.put("title", titles[i]);
            alert.put("description", descriptions[i]);
            alert.put("category", categories[i]);
            alert.put("priority", priorities[i]);
            alert.put("time", times[i]);
            alert.put("read", read[i]);
            alerts.add(alert);
        }
        
        return alerts;
    }

    /**
     * Get inventory data
     * @return List of inventory items
     */
    public List<Map<String, Object>> getInventory() {
        List<Map<String, Object>> inventory = new ArrayList<>();
        
        String[] names = {
            "Paracétamol 500mg",
            "Amoxicilline 1g",
            "Ibuprofène 400mg",
            "Oméprazole 20mg",
            "Doliprane 1000mg",
            "Ventoline spray"
        };
        
        String[] categories = {
            "antidouleur",
            "antibiotique",
            "antiinflammatoire",
            "antiacide",
            "antidouleur",
            "respiratoire"
        };
        
        int[] stocks = {5, 8, 12, 7, 10, 18};
        int[] thresholds = {20, 15, 25, 15, 20, 10};
        double[] prices = {49.9, 85.0, 67.5, 123.0, 52.5, 159.9};
        
        for (int i = 0; i < names.length; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", i+1);
            item.put("name", names[i]);
            item.put("category", categories[i]);
            item.put("stock", stocks[i]);
            item.put("threshold", thresholds[i]);
            
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MONTH, 4 + i);
            Date expiryDate = cal.getTime();
            
            item.put("expiryDate", expiryDate);
            item.put("price", prices[i]);
            inventory.add(item);
        }
        
        return inventory;
    }

    /**
     * Get clients data
     * @return List of clients
     */
    public List<Map<String, Object>> getClients() {
        List<Map<String, Object>> clients = new ArrayList<>();
        
        String[] names = {
            "Mohammed Alami",
            "Fatima Benali",
            "Youssef Mansouri",
            "Amina Tazi",
            "Karim Idrissi"
        };
        
        String[] emails = {
            "mohammed.alami@gmail.com",
            "fatima.benali@gmail.com",
            "youssef.mansouri@gmail.com",
            "amina.tazi@gmail.com",
            "karim.idrissi@gmail.com"
        };
        
        String[] phones = {
            "06 12 34 56 78",
            "06 23 45 67 89",
            "06 34 56 78 90",
            "06 45 67 89 01",
            "06 56 78 90 12"
        };
        
        String[] status = {
            "régulier",
            "régulier",
            "occasionnel",
            "nouveau",
            "régulier"
        };
        
        boolean[] hasPrescription = {true, false, true, true, false};
        
        for (int i = 0; i < names.length; i++) {
            Map<String, Object> client = new HashMap<>();
            client.put("id", i+1);
            client.put("name", names[i]);
            client.put("email", emails[i]);
            client.put("phone", phones[i]);
            
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.YEAR, -30 - i * 5);
            cal.add(Calendar.MONTH, -i * 2);
            cal.add(Calendar.DAY_OF_MONTH, -i * 5);
            Date birthDate = cal.getTime();
            client.put("birthDate", birthDate);
            
            cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, -i);
            Date lastVisit = cal.getTime();
            client.put("lastVisit", lastVisit);
            
            client.put("status", status[i]);
            client.put("hasPrescription", hasPrescription[i]);
            client.put("avatar", "/placeholder-user.jpg");
            
            clients.add(client);
        }
        
        return clients;
    }

    /**
     * Get calendar events
     * @return List of calendar events
     */
    public List<Map<String, Object>> getCalendarEvents() {
        List<Map<String, Object>> events = new ArrayList<>();
        
        String[] titles = {
            "Consultation M. Alami",
            "Livraison fournisseur",
            "Réunion équipe",
            "Consultation Mme Tazi",
            "Inventaire mensuel"
        };
        
        String[] types = {"appointment", "delivery", "meeting", "appointment", "other"};
        String[] times = {"09:00", "14:00", "10:00", "11:00", "16:00"};
        String[] clients = {"Mohammed Alami", "MediSupply Maroc", "Interne", "Amina Tazi", "Interne"};
        
        LocalDate now = LocalDate.now();
        
        for (int i = 0; i < titles.length; i++) {
            Map<String, Object> event = new HashMap<>();
            event.put("id", i+1);
            event.put("title", titles[i]);
            event.put("date", now.plusDays(i));
            event.put("time", times[i]);
            event.put("type", types[i]);
            event.put("client", clients[i]);
            events.add(event);
        }
        
        return events;
    }

    /**
     * Get analytics data for admin dashboard
     * @return List of analytics data
     */
    public List<Map<String, Object>> getAnalyticsData() {
        List<Map<String, Object>> analytics = new ArrayList<>();
        
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalRevenue", 125000);
        overview.put("revenueChange", 12.5);
        overview.put("averageOrderValue", 420);
        overview.put("conversionRate", 3.2);
        
        analytics.add(overview);
        
        return analytics;
    }

    /**
     * Get settings data for admin dashboard
     * @return Map of settings data
     */
    public Map<String, Object> getSettingsData() {
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
        
        Map<String, Object> technicianRole = new HashMap<>();
        technicianRole.put("name", "Technician");
        technicianRole.put("count", 8);
        roles.add(technicianRole);
        
        users.put("roles", roles);
        settings.put("users", users);
        
        Map<String, Object> system = new HashMap<>();
        system.put("version", "1.0.0");
        system.put("lastBackup", LocalDate.now().minusDays(1).toString());
        
        Map<String, Object> storage = new HashMap<>();
        storage.put("used", 25);
        storage.put("total", 100);
        system.put("storage", storage);
        
        settings.put("system", system);
        
        return settings;
    }

    /**
     * Get prescriptions data for pharmacist dashboard
     * @return Map of prescriptions data
     */
    public Map<String, Object> getPrescriptionsData() {
        Map<String, Object> prescriptions = new HashMap<>();
        prescriptions.put("total", 45);
        prescriptions.put("pending", 12);
        prescriptions.put("completed", 33);
        
        List<Map<String, Object>> recentPrescriptions = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = 0; i < 5; i++) {
            Map<String, Object> prescription = new HashMap<>();
            prescription.put("id", "P" + (1000 + i));
            
            Map<String, Object> patient = new HashMap<>();
            patient.put("name", "Patient " + (i + 1));
            patient.put("avatar", null);
            prescription.put("patient", patient);
            
            prescription.put("doctor", "Dr. Benjelloun");
            prescription.put("date", now.minusDays(i).toString());
            prescription.put("status", i % 3 == 0 ? "completed" : i % 3 == 1 ? "pending" : "cancelled");
            
            List<Map<String, Object>> medications = new ArrayList<>();
            
            Map<String, Object> med1 = new HashMap<>();
            med1.put("name", "Paracétamol 500mg");
            med1.put("quantity", 2);
            medications.add(med1);
            
            Map<String, Object> med2 = new HashMap<>();
            med2.put("name", "Amoxicilline 1g");
            med2.put("quantity", 1);
            medications.add(med2);
            
            prescription.put("medications", medications);
            recentPrescriptions.add(prescription);
        }
        
        prescriptions.put("recent", recentPrescriptions);
        return prescriptions;
    }
} 