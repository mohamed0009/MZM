package com.mzm.pharmaflow.controller;

import com.mzm.pharmaflow.dto.ProductDTO;
import com.mzm.pharmaflow.dto.ResponseDTO;
import com.mzm.pharmaflow.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class InventoryController {

    private final ProductService productService;
    
    @Autowired
    public InventoryController(ProductService productService) {
        this.productService = productService;
    }
    
    @GetMapping("/products")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        try {
            List<ProductDTO> products = productService.findAll();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error fetching products: " + e.getMessage(), e);
        }
    }

    @GetMapping("/products/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        try {
            ProductDTO product = productService.findById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Product not found with ID: " + id, e);
        }
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        try {
            ProductDTO createdProduct = productService.save(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Error creating product: " + e.getMessage(), e);
        }
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id, 
            @Valid @RequestBody ProductDTO productDTO) {
        try {
            productDTO.setId(id);
            ProductDTO updatedProduct = productService.update(productDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Error updating product: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteProduct(@PathVariable Long id) {
        try {
            productService.delete(id);
            return ResponseEntity.ok(new ResponseDTO(true, "Product deleted successfully"));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Error deleting product: " + e.getMessage(), e);
        }
    }

    @GetMapping("/products/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String query) {
        try {
            List<ProductDTO> products = productService.search(query);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error searching products: " + e.getMessage(), e);
        }
    }

    @GetMapping("/products/low-stock")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts() {
        try {
            List<ProductDTO> products = productService.findLowStock();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error fetching low stock products: " + e.getMessage(), e);
        }
    }

    @GetMapping("/products/expiring-soon")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProductDTO>> getExpiringSoonProducts() {
        try {
            List<ProductDTO> products = productService.findExpiringSoon();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error fetching expiring products: " + e.getMessage(), e);
        }
    }
} 