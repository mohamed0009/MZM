package com.mzm.pharmaflow.service.impl;

import com.mzm.pharmaflow.dto.ProductDTO;
import com.mzm.pharmaflow.model.Product;
import com.mzm.pharmaflow.repository.ProductRepository;
import com.mzm.pharmaflow.service.ProductService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        return convertToDTO(product);
    }

    @Override
    public ProductDTO save(ProductDTO productDTO) {
        validateProductCode(productDTO);
        Product product = convertToEntity(productDTO);
        product = productRepository.save(product);
        return convertToDTO(product);
    }

    @Override
    public ProductDTO update(ProductDTO productDTO) {
        // Check if product exists
        productRepository.findById(productDTO.getId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productDTO.getId()));
        
        Product product = convertToEntity(productDTO);
        product = productRepository.save(product);
        return convertToDTO(product);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDTO> search(String query) {
        return productRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> findLowStock() {
        // Products with quantity less than 10 are considered low stock
        return productRepository.findByQuantityLessThan(10).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> findExpiringSoon() {
        // Products expiring in the next 30 days
        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30);
        return productRepository.findByExpiryDateBefore(thirtyDaysFromNow).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validateProductCode(ProductDTO productDTO) {
        // Don't validate code for update operations
        if (productDTO.getId() != null) {
            return;
        }
        
        if (productRepository.existsByCode(productDTO.getCode())) {
            throw new RuntimeException("Product code already exists: " + productDTO.getCode());
        }
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO);
        return productDTO;
    }

    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        return product;
    }
} 