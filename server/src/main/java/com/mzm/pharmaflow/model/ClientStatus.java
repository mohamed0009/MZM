package com.mzm.pharmaflow.model;

public enum ClientStatus {
    NOUVEAU,       // Nouveau client
    REGULIER,      // Client régulier (visite dans les 3 derniers mois)
    OCCASIONNEL,   // Client occasionnel (visite entre 3 et 6 mois)
    INACTIF,       // Client inactif (pas de visite depuis plus de 6 mois)
    ACTIVE         // Statut par défaut (compatibilité avec code existant)
} 