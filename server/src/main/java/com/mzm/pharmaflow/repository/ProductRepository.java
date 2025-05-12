package com.mzm.pharmaflow.repository;

import com.mzm.pharmaflow.model.Product;
import com.mzm.pharmaflow.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCode(String code);
    List<Product> findByCategory(ProductCategory category);
    List<Product> findByExpiryDateBefore(LocalDate date);
    List<Product> findByQuantityLessThan(Integer quantity);
    List<Product> findByNameContainingIgnoreCase(String name);
    Boolean existsByCode(String code);
} 