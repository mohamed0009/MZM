package com.mzm.pharmaflow.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private ProductCategory category;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Integer threshold;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(nullable = false)
    private LocalDate expiryDate;
    
    private String manufacturer;
    
    private String imageUrl;
    
    private Boolean needsPrescription;
    
    private String dosage;
    
    private String formulation;
    
    @Column(nullable = false)
    private LocalDate createdAt;
    
    private LocalDate updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }
    
    /**
     * Check if the product has low stock
     * @return true if stock is low
     */
    public boolean isLowStock() {
        return quantity <= threshold;
    }
    
    /**
     * Check if the product is expired
     * @return true if expired
     */
    public boolean isExpired() {
        return expiryDate.isBefore(LocalDate.now());
    }
    
    /**
     * Check if expiry is near (within 30 days)
     * @return true if expiry is within 30 days
     */
    public boolean isExpiryNear() {
        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30);
        return expiryDate.isAfter(LocalDate.now()) && expiryDate.isBefore(thirtyDaysFromNow);
    }
} 