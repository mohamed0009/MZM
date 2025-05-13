package com.mzm.pharmaflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate birthDate;
    private String address;
    private String status;
    private LocalDate lastVisit;
    private String medicalNotes;
    private Boolean hasPrescription;
    private String avatar;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}