package com.mzm.pharmaflow.service.impl;

import com.mzm.pharmaflow.dto.ProductDTO;
import com.mzm.pharmaflow.model.Product;
import com.mzm.pharmaflow.model.ProductCategory;
import com.mzm.pharmaflow.repository.ProductRepository;
import com.mzm.pharmaflow.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    /**
     * Convert Product entity to ProductDTO
     * @param product entity to convert
     * @return converted DTO
     */
    private ProductDTO convertToDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setCode(product.getCode());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory().name());
        dto.setQuantity(product.getQuantity());
        dto.setThreshold(product.getThreshold());
        dto.setPrice(product.getPrice());
        dto.setExpiryDate(product.getExpiryDate());
        dto.setManufacturer(product.getManufacturer());
        dto.setImageUrl(product.getImageUrl());
        dto.setNeedsPrescription(product.getNeedsPrescription());
        dto.setDosage(product.getDosage());
        dto.setFormulation(product.getFormulation());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
    
    /**
     * Convert ProductDTO to Product entity
     * @param dto DTO to convert
     * @return converted entity
     */
    private Product convertToEntity(ProductDTO dto) {
        Product product = dto.getId() != null
                ? productRepository.findById(dto.getId())
                        .orElse(new Product())
                : new Product();
        
        product.setName(dto.getName());
        product.setCode(dto.getCode());
        product.setDescription(dto.getDescription());
        product.setCategory(ProductCategory.valueOf(dto.getCategory()));
        product.setQuantity(dto.getQuantity());
        product.setThreshold(dto.getThreshold());
        product.setPrice(dto.getPrice());
        product.setExpiryDate(dto.getExpiryDate());
        product.setManufacturer(dto.getManufacturer());
        product.setImageUrl(dto.getImageUrl());
        product.setNeedsPrescription(dto.getNeedsPrescription());
        product.setDosage(dto.getDosage());
        product.setFormulation(dto.getFormulation());
        return product;
    }
    
    @Override
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return convertToDto(product);
    }
    
    @Override
    public ProductDTO save(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }
    
    @Override
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
    
    @Override
    public List<ProductDTO> findByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductDTO> findLowStockProducts() {
        return productRepository.findByQuantityLessThanEqualToThreshold().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductDTO> findByCategory(String category) {
        ProductCategory productCategory;
        try {
            productCategory = ProductCategory.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid product category: " + category);
        }
        return productRepository.findByCategory(productCategory.name()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get total count
        long totalCount = productRepository.count();
        stats.put("totalCount", totalCount);
        
        // Get low stock count
        long lowStockCount = productRepository.findByQuantityLessThanEqualToThreshold().size();
        stats.put("lowStockCount", lowStockCount);
        
        // Get categories distribution
        Map<ProductCategory, Long> categoryDistribution = new HashMap<>();
        for (ProductCategory category : ProductCategory.values()) {
            long count = productRepository.findByCategory(category.name()).size();
            categoryDistribution.put(category, count);
        }
        stats.put("categoryDistribution", categoryDistribution);
        
        // Get total value
        BigDecimal totalValue = BigDecimal.ZERO;
        for (Product product : productRepository.findAll()) {
            BigDecimal itemValue = product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()));
            totalValue = totalValue.add(itemValue);
        }
        stats.put("totalValue", totalValue);
        
        return stats;
    }
} 