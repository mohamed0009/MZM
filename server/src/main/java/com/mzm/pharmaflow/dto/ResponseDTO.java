package com.mzm.pharmaflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Standard response DTO for API operations
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDTO {
    private boolean success;
    private String message;
    private Object data;
    private List<Map<String, String>> errors;
    private long timestamp = System.currentTimeMillis();
    
    public ResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public ResponseDTO(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    public ResponseDTO(boolean success, Object data) {
        this.success = success;
        this.data = data;
    }
    
    public static ResponseDTO success(String message) {
        return new ResponseDTO(true, message);
    }
    
    public static ResponseDTO success(String message, Object data) {
        ResponseDTO response = new ResponseDTO(true, message);
        response.setData(data);
        return response;
    }
    
    public static ResponseDTO error(String message) {
        return new ResponseDTO(false, message);
    }
} 