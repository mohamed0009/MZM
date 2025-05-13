package com.mzm.pharmaflow.repository;

import com.mzm.pharmaflow.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    Boolean existsByCode(String code);
    
    /**
     * Find products with stock below threshold
     * @return list of products with low stock
     */
    List<Product> findByQuantityLessThanEqualToThreshold();
    
    /**
     * Find products by category
     * @param category product category
     * @return list of products in the category
     */
    List<Product> findByCategory(String category);
} 