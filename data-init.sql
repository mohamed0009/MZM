-- Insert sample products
INSERT INTO products (id, name, code, description, category, quantity, threshold, price, expiry_date, manufacturer, needs_prescription, created_at)
VALUES 
(1, 'Paracétamol 500mg', 'MED1001', 'Analgésique et antipyrétique', 'ANALGESIC', 250, 50, 8.50, '2025-12-31', 'Sanofi', FALSE, CURRENT_DATE()),
(2, 'Ibuprofène 200mg', 'MED1002', 'Anti-inflammatoire non stéroïdien', 'NSAID', 180, 40, 10.20, '2025-10-15', 'Pfizer', FALSE, CURRENT_DATE()),
(3, 'Amoxicilline 500mg', 'MED1003', 'Antibiotique de la famille des bêta-lactamines', 'ANTIBIOTIC', 120, 30, 15.75, '2024-08-20', 'Novartis', TRUE, CURRENT_DATE()),
(4, 'Doliprane 1000mg', 'MED1004', 'Paracétamol en comprimés', 'ANALGESIC', 300, 60, 7.25, '2025-09-15', 'Sanofi', FALSE, CURRENT_DATE()),
(5, 'Ventoline', 'MED1005', 'Bronchodilatateur pour l\'asthme', 'RESPIRATORY', 80, 20, 19.99, '2026-01-10', 'GlaxoSmithKline', TRUE, CURRENT_DATE()),
(6, 'Smecta', 'MED1006', 'Traitement des diarrhées', 'DIGESTIVE', 150, 30, 6.50, '2024-11-25', 'Ipsen', FALSE, CURRENT_DATE()),
(7, 'Xanax 0.25mg', 'MED1007', 'Anxiolytique, traitement de l\'anxiété', 'PSYCHIATRIC', 60, 15, 22.99, '2025-05-20', 'Pfizer', TRUE, CURRENT_DATE()),
(8, 'Augmentin 1g', 'MED1008', 'Antibiotique à large spectre', 'ANTIBIOTIC', 90, 25, 18.50, '2024-06-15', 'GlaxoSmithKline', TRUE, CURRENT_DATE()),
(9, 'Voltarène Gel 1%', 'MED1009', 'Anti-inflammatoire topique', 'NSAID', 120, 25, 9.75, '2026-03-10', 'Novartis', FALSE, CURRENT_DATE()),
(10, 'Daflon 500mg', 'MED1010', 'Veinotonique', 'VASCULAR', 200, 40, 12.30, '2025-07-15', 'Servier', FALSE, CURRENT_DATE());

-- Insert sample clients
INSERT INTO clients (id, first_name, last_name, email, phone, address, medical_history, status, birth_date, has_prescription, created_at)
VALUES 
(1, 'Sophie', 'Dubois', 'sophie.dubois@example.com', '0612345678', '123 Rue Principale, Casablanca', 'Patient depuis 2018. Allergie aux pénicillines.', 'REGULIER', '1985-06-15', TRUE, CURRENT_DATE()),
(2, 'Mohammed', 'Alami', 'mohammed.alami@example.com', '0623456789', '45 Avenue Hassan II, Rabat', 'Patient depuis 2019. Diabète type 2.', 'NOUVEAU', '1972-03-22', FALSE, CURRENT_DATE()),
(3, 'Fatima', 'Benani', 'fatima.benani@example.com', '0634567890', '78 Rue des Écoles, Marrakech', 'Patiente depuis 2017. Hypertension artérielle.', 'REGULIER', '1968-11-05', TRUE, CURRENT_DATE()),
(4, 'Omar', 'Chraibi', 'omar.chraibi@example.com', '0645678901', '12 Boulevard Mohammed V, Tanger', 'Patient depuis 2020. Asthmatique.', 'NOUVEAU', '1990-08-12', TRUE, CURRENT_DATE()),
(5, 'Amina', 'Tazi', 'amina.tazi@example.com', '0656789012', '34 Rue Ibn Sina, Fès', 'Patiente depuis 2015. Allergie à l\'aspirine.', 'REGULIER', '1982-04-25', FALSE, CURRENT_DATE()),
(6, 'Karim', 'Idrissi', 'karim.idrissi@example.com', '0667890123', '56 Avenue des FAR, Agadir', 'Patient depuis 2021. Cholestérol élevé.', 'OCCASIONNEL', '1975-09-30', TRUE, CURRENT_DATE()),
(7, 'Nadia', 'Lahlou', 'nadia.lahlou@example.com', '0678901234', '89 Rue Moulay Ismail, Meknès', 'Patiente depuis 2018. Hypothyroïdie.', 'REGULIER', '1988-02-18', TRUE, CURRENT_DATE()),
(8, 'Youssef', 'Mansouri', 'youssef.mansouri@example.com', '0689012345', '23 Boulevard Zerktouni, Casablanca', 'Patient depuis 2019. Aucune allergie connue.', 'OCCASIONNEL', '1992-07-14', FALSE, CURRENT_DATE());

-- Insert roles if they don't exist
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER'),
(3, 'ROLE_PHARMACIST'),
(4, 'ROLE_TECHNICIAN');

-- Insert default admin user
INSERT INTO users (id, username, email, password) VALUES 
(1, 'admin', 'admin@pharmaflow.com', '$2a$10$qS3SkrZLkK0U/bYT.w2IceCrY4PnjIrpAw/Y0KjmH4WV7BkBp.FDu');  -- Password: Admin123!

-- Link user to role
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); 