package com.mzm.pharmaflow.controller;

import com.mzm.pharmaflow.dto.ProductDTO;
import com.mzm.pharmaflow.dto.ResponseDTO;
import com.mzm.pharmaflow.model.Product;
import com.mzm.pharmaflow.model.ProductCategory;
import com.mzm.pharmaflow.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    /**
     * Get all products
     * @return list of all products
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.findAll();
        return ResponseEntity.ok(products);
    }
    
    /**
     * Get product by ID
     * @param id product ID
     * @return product with the specified ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.findById(id);
        return ResponseEntity.ok(product);
    }
    
    /**
     * Create a new product
     * @param productDTO product data
     * @return created product
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.save(productDTO);
        return ResponseEntity.ok(createdProduct);
    }
    
    /**
     * Update an existing product
     * @param id product ID
     * @param productDTO updated product data
     * @return updated product
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        productDTO.setId(id);
        ProductDTO updatedProduct = productService.save(productDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    
    /**
     * Delete a product
     * @param id product ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteProduct(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.ok(new ResponseDTO(true, "Product deleted successfully"));
    }
    
    /**
     * Search products by name
     * @param name name to search for
     * @return list of matching products
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String name) {
        List<ProductDTO> products = productService.findByName(name);
        return ResponseEntity.ok(products);
    }
    
    /**
     * Get products with low stock
     * @return list of products with low stock
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts() {
        List<ProductDTO> products = productService.findLowStockProducts();
        return ResponseEntity.ok(products);
    }
    
    /**
     * Get products by category
     * @param category product category
     * @return list of products in the category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        List<ProductDTO> products = productService.findByCategory(category);
        return ResponseEntity.ok(products);
    }
    
    /**
     * Get all product categories
     * @return list of all product categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getAllCategories() {
        List<Map<String, Object>> categories = Arrays.stream(ProductCategory.values())
            .map(category -> {
                Map<String, Object> categoryMap = new HashMap<>();
                categoryMap.put("name", category.name());
                categoryMap.put("label", category.name().toLowerCase());
                return categoryMap;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }
    
    /**
     * Get products statistics
     * @return products statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        Map<String, Object> stats = productService.getStats();
        return ResponseEntity.ok(stats);
    }
} 