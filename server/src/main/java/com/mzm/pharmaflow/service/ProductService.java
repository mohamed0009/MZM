package com.mzm.pharmaflow.service;

import com.mzm.pharmaflow.dto.ProductDTO;

import java.util.List;
import java.util.Map;

public interface ProductService {
    
    /**
     * Find all products
     * @return list of all products
     */
    List<ProductDTO> findAll();
    
    /**
     * Find product by ID
     * @param id product ID
     * @return product with the specified ID
     */
    ProductDTO findById(Long id);
    
    /**
     * Save a product (create or update)
     * @param productDTO product data
     * @return saved product
     */
    ProductDTO save(ProductDTO productDTO);
    
    /**
     * Delete product by ID
     * @param id product ID
     */
    void deleteById(Long id);
    
    /**
     * Find products by name
     * @param name name to search for
     * @return list of matching products
     */
    List<ProductDTO> findByName(String name);
    
    /**
     * Find products with low stock
     * @return list of products with low stock
     */
    List<ProductDTO> findLowStockProducts();
    
    /**
     * Find products by category
     * @param category product category
     * @return list of products in the category
     */
    List<ProductDTO> findByCategory(String category);
    
    /**
     * Get products statistics
     * @return products statistics
     */
    Map<String, Object> getStats();
} 