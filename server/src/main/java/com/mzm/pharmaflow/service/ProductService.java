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
     * Update an existing product
     * @param productDTO product data to update
     * @return updated product
     */
    ProductDTO update(ProductDTO productDTO);
    
    /**
     * Delete product by ID
     * @param id product ID
     */
    void deleteById(Long id);
    
    /**
     * Delete product by ID (alias for deleteById)
     * @param id product ID
     */
    default void delete(Long id) {
        deleteById(id);
    }
    
    /**
     * Find products by name
     * @param name name to search for
     * @return list of matching products
     */
    List<ProductDTO> findByName(String name);
    
    /**
     * Search products by name or description
     * @param query search query
     * @return list of matching products
     */
    List<ProductDTO> search(String query);
    
    /**
     * Find products with low stock
     * @return list of products with low stock
     */
    List<ProductDTO> findLowStockProducts();
    
    /**
     * Find products with low stock (alias for findLowStockProducts)
     * @return list of products with low stock
     */
    default List<ProductDTO> findLowStock() {
        return findLowStockProducts();
    }
    
    /**
     * Find products expiring soon
     * @return list of products expiring soon
     */
    List<ProductDTO> findExpiringSoon();
    
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