package com.mzm.pharmaflow.service;

import com.mzm.pharmaflow.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    List<ProductDTO> findAll();
    
    ProductDTO findById(Long id);
    
    ProductDTO save(ProductDTO productDTO);
    
    ProductDTO update(ProductDTO productDTO);
    
    void delete(Long id);
    
    List<ProductDTO> search(String query);
    
    List<ProductDTO> findLowStock();
    
    List<ProductDTO> findExpiringSoon();
} 