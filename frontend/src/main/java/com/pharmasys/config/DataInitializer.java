package com.pharmasys.config;

import com.pharmasys.model.*;
import com.pharmasys.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles
        initRoles();
        
        // Initialize users
        initUsers();
        
        // Initialize medications
        initMedications();
        
        // Initialize clients
        initClients();
        
        // Initialize alerts
        initAlerts();
        
        // Initialize events
        initEvents();
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            roleRepository.save(new Role(ERole.ROLE_MANAGER));
            roleRepository.save(new Role(ERole.ROLE_PHARMACIST));
            roleRepository.save(new Role(ERole.ROLE_ASSISTANT));
        }
    }

    private void initUsers() {
        if (userRepository.count() == 0) {
            // Create admin user
            User adminUser = new User(
                    "admin",
                    "admin@mzm.ma",
                    encoder.encode("password"),
                    "Administrateur MZM"
            );
            adminUser.setPharmacyName("Pharmacie MZM");
            adminUser.setEmailVerified(true);
            
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow());
            adminUser.setRoles(adminRoles);
            
            userRepository.save(adminUser);
            
            // Create pharmacist user
            User pharmacistUser = new User(
                    "pharmacien",
                    "pharmacien@mzm.ma",
                    encoder.encode("password"),
                    "Pharmacien MZM"
            );
            pharmacistUser.setPharmacyName("Pharmacie MZM");
            pharmacistUser.setEmailVerified(true);
            
            Set<Role> pharmacistRoles = new HashSet<>();
            pharmacistRoles.add(roleRepository.findByName(ERole.ROLE_PHARMACIST).orElseThrow());
            pharmacistUser.setRoles(pharmacistRoles);
            
            userRepository.save(pharmacistUser);
        }
    }

    private void initMedications() {
        if (medicationRepository.count() == 0) {
            medicationRepository.save(new Medication(null, "Paracétamol 500mg", MedicationCategory.ANTIDOULEUR, 5, 20, LocalDate.now().plusMonths(6), 49.9, null, null));
            medicationRepository.save(new Medication(null, "Amoxicilline 1g", MedicationCategory.ANTIBIOTIQUE, 8, 15, LocalDate.now().plusMonths(2), 85.0, null, null));
            medicationRepository.save(new Medication(null, "Ibuprofène 400mg", MedicationCategory.ANTIINFLAMMATOIRE, 12, 25, LocalDate.now().plusMonths(10), 67.5, null, null));
            medicationRepository.save(new Medication(null, "Oméprazole 20mg", MedicationCategory.ANTIACIDE, 7, 15, LocalDate.now().plusMonths(4), 123.0, null, null));
            medicationRepository.save(new Medication(null, "Doliprane 1000mg", MedicationCategory.ANTIDOULEUR, 10, 20, LocalDate.now().plusMonths(6), 52.5, null, null));
            medicationRepository.save(new Medication(null, "Ventoline spray", MedicationCategory.RESPIRATOIRE, 18, 10, LocalDate.now().plusMonths(2), 159.9, null, null));
            medicationRepository.save(new Medication(null, "Augmentin 1g", MedicationCategory.ANTIBIOTIQUE, 22, 15, LocalDate.now().plusMonths(2), 98.0, null, null));
            medicationRepository.save(new Medication(null, "Bisoprolol 5mg", MedicationCategory.CARDIOVASCULAIRE, 30, 20, LocalDate.now().plusMonths(10), 74.5, null, null));
            medicationRepository.save(new Medication(null, "Aspirine 500mg", MedicationCategory.ANTIDOULEUR, 45, 30, LocalDate.now().plusMonths(12), 39.9, null, null));
            medicationRepository.save(new Medication(null, "Metformine 850mg", MedicationCategory.ANTIDIABETIQUE, 25, 20, LocalDate.now().plusMonths(8), 82.0, null, null));
        }
    }

    private void initClients() {
        if (clientRepository.count() == 0) {
            clientRepository.save(new Client(null, "Mohammed Alami", "mohammed.alami@gmail.com", "06 12 34 56 78", LocalDate.of(1975, 6, 15), LocalDate.now().minusDays(5), ClientStatus.REGULIER, true, "/placeholder-user.jpg", null, null));
            clientRepository.save(new Client(null, "Fatima Benali", "fatima.benali@gmail.com", "06 23 45 67 89", LocalDate.of(1982, 9, 22), LocalDate.now(), ClientStatus.REGULIER, false, "/placeholder-user.jpg", null, null));
            clientRepository.save(new Client(null, "Youssef Mansouri", "youssef.mansouri@gmail.com", "06 34 56 78 90", LocalDate.of(1968, 3, 10), LocalDate.now().minusDays(15), ClientStatus.OCCASIONNEL, true, "/placeholder-user.jpg", null, null));
            clientRepository.save(new Client(null, "Amina Tazi", "amina.tazi@gmail.com", "06 45 67 89 01", LocalDate.of(1990, 12, 5), LocalDate.now().minusDays(2), ClientStatus.NOUVEAU, true, "/placeholder-user.jpg", null, null));
            clientRepository.save(new Client(null, "Karim Idrissi", "karim.idrissi@gmail.com", "06 56 78 90 12", LocalDate.of(1985, 8, 30), LocalDate.now().minusDays(10), ClientStatus.REGULIER, false, "/placeholder-user.jpg", null, null));
            clientRepository.save(new Client(null, "Nadia Chraibi", "nadia.chraibi@gmail.com", "06 67 89 01 23", LocalDate.of(1995, 5, 12), LocalDate.now(), ClientStatus.NOUVEAU, false, "/placeholder-user.jpg", null, null));
            clientRepository.save(new Client(null, "Hassan Benjelloun", "hassan.benjelloun@gmail.com", "06 78 90 12 34", LocalDate.of(1972, 10, 8), LocalDate.now().minusDays(20), ClientStatus.REGULIER, true, "/placeholder-user.jpg", null, null));
        }
    }

    private void initAlerts() {
        if (alertRepository.count() == 0) {
            alertRepository.save(new Alert(null, "Stock critique - Paracétamol 500mg", "Le stock est descendu à 5 unités (seuil: 20)", AlertCategory.STOCK, AlertPriority.HIGH, false, null));
            alertRepository.save(new Alert(null, "Stock critique - Amoxicilline 1g", "Le stock est descendu à 8 unités (seuil: 15)", AlertCategory.STOCK, AlertPriority.HIGH, false, null));
            alertRepository.save(new Alert(null, "Stock faible - Ibuprofène 400mg", "Le stock est descendu à 12 unités (seuil: 25)", AlertCategory.STOCK, AlertPriority.MEDIUM, false, null));
            alertRepository.save(new Alert(null, "Expiration proche - Insuline Lantus", "Expire dans 7 jours (15/05/2024)", AlertCategory.EXPIRY, AlertPriority.HIGH, false, null));
            alertRepository.save(new Alert(null, "Expiration proche - Vaccin Antigrippal", "Expire dans 5 jours (10/05/2024)", AlertCategory.EXPIRY, AlertPriority.HIGH, true, null));
            alertRepository.save(new Alert(null, "Expiration proche - Amoxicilline sirop", "Expire dans 20 jours (25/05/2024)", AlertCategory.EXPIRY, AlertPriority.MEDIUM, false, null));
            alertRepository.save(new Alert(null, "Commande #3452 livrée", "La commande de MediSupply a été livrée", AlertCategory.ORDER, AlertPriority.LOW, false, null));
            alertRepository.save(new Alert(null, "Nouvelle commande #3456 passée", "Commande de médicaments cardiovasculaires envoyée", AlertCategory.ORDER, AlertPriority.MEDIUM, true, null));
        }
    }

    private void initEvents() {
        if (eventRepository.count() == 0) {
            eventRepository.save(new Event(null, "Consultation M. Alami", null, LocalDate.now().plusDays(2), LocalTime.of(9, 0), LocalTime.of(9, 30), EventType.APPOINTMENT, "Mohammed Alami", null, null));
            eventRepository.save(new Event(null, "Livraison fournisseur", "Livraison de médicaments", LocalDate.now().plusDays(2), LocalTime.of(14, 0), LocalTime.of(15, 0), EventType.DELIVERY, "MediSupply Maroc", null, null));
            eventRepository.save(new Event(null, "Réunion équipe", "Réunion hebdomadaire", LocalDate.now().plusDays(3), LocalTime.of(10, 0), LocalTime.of(11, 0), EventType.MEETING, "Interne", null, null));
            eventRepository.save(new Event(null, "Consultation Mme Tazi", null, LocalDate.now().plusDays(4), LocalTime.of(11, 0), LocalTime.of(11, 30), EventType.APPOINTMENT, "Amina Tazi", null, null));
            eventRepository.save(new Event(null, "Inventaire mensuel", "Inventaire complet de la pharmacie", LocalDate.now().plusDays(5), LocalTime.of(16, 0), LocalTime.of(18, 0), EventType.OTHER, "Interne", null, null));
        }
    }
}
