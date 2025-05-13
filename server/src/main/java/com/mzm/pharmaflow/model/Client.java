package com.mzm.pharmaflow.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @Email
    @Size(max = 100)
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$")
    private String phone;

    @Size(max = 200)
    private String address;

    @Size(max = 1000)
    private String medicalHistory;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ClientStatus status = ClientStatus.ACTIVE;

    @Column(nullable = true)
    private LocalDate birthDate;

    @Column(nullable = true)
    private LocalDate lastVisit;

    private String medicalNotes;

    private Boolean hasPrescription;

    private String avatar;

    @Column(nullable = false)
    private LocalDate createdAt;

    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        if (status == null) {
            status = ClientStatus.NOUVEAU;
        }
        if (hasPrescription == null) {
            hasPrescription = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }

    /**
     * Check if client is a regular client (visited in last 3 months)
     * @return true if regular client
     */
    public boolean isRegularClient() {
        if (lastVisit == null) {
            return false;
        }
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        return lastVisit.isAfter(threeMonthsAgo);
    }

    /**
     * Update client status based on last visit
     */
    public void updateStatus() {
        if (lastVisit == null) {
            status = ClientStatus.NOUVEAU;
            return;
        }
        
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        
        if (lastVisit.isAfter(threeMonthsAgo)) {
            status = ClientStatus.REGULIER;
        } else if (lastVisit.isAfter(sixMonthsAgo)) {
            status = ClientStatus.OCCASIONNEL;
        } else {
            status = ClientStatus.INACTIF;
        }
    }
} 