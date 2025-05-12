package com.mzm.pharmaflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard response DTO for API operations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO {
    private String message;
    private Object data;
    private boolean success;
    private long timestamp = System.currentTimeMillis();
    
    public ResponseDTO(String message) {
        this.message = message;
        this.success = true;
    }
    
    public ResponseDTO(String message, Object data) {
        this.message = message;
        this.data = data;
        this.success = true;
    }
    
    public ResponseDTO(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
    
    public static ResponseDTO success(String message) {
        return new ResponseDTO(message, true);
    }
    
    public static ResponseDTO success(String message, Object data) {
        ResponseDTO response = new ResponseDTO(message, true);
        response.setData(data);
        return response;
    }
    
    public static ResponseDTO error(String message) {
        return new ResponseDTO(message, false);
    }
} 