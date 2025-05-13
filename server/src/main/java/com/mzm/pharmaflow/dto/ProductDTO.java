package com.mzm.pharmaflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    
    private Long id;
    private String name;
    private String code;
    private String description;
    private String category;
    private Integer quantity;
    private Integer threshold;
    private BigDecimal price;
    private LocalDate expiryDate;
    private String manufacturer;
    private String imageUrl;
    private Boolean needsPrescription;
    private String dosage;
    private String formulation;
    private LocalDate createdAt;
    private LocalDate updatedAt;
} 