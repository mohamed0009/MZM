package com.pharmasys.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String name;
    private String pharmacyName;
    private List<String> roles;

    public JwtResponse(String token, Long id, String username, String email, String name, String pharmacyName, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.pharmacyName = pharmacyName;
        this.roles = roles;
    }
}
