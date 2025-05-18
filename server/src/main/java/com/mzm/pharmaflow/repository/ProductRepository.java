package com.mzm.pharmaflow.repository;

import com.mzm.pharmaflow.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    
    Boolean existsByCode(String code);
    
    /**
     * Find products with stock below threshold
     * @return list of products with low stock
     */
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.threshold")
    List<Product> findByQuantityLessThanEqualToThreshold();
    
    /**
     * Find products expiring before a given date
     * @param date date to check expiry against
     * @return list of products expiring before the date
     */
    List<Product> findByExpiryDateBefore(LocalDate date);
    
    /**
     * Find products by category
     * @param category product category
     * @return list of products in the category
     */
    List<Product> findByCategory(String category);
} 