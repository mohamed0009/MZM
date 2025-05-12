package com.mzm.pharmaflow.dto;

/**
 * DTO pour représenter un utilisateur avec des informations de base.
 * Les rôles sont alignés avec ceux définis dans le frontend.
 */
public class UserDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String name;
    private String role; // "ADMIN", "PHARMACIST", "TECHNICIAN" - aligné avec le frontend

    // Constructeurs
    public UserDto() {
    }

    public UserDto(String id, String email, String firstName, String lastName, String role) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.name = firstName + " " + lastName;
        this.role = role;
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateName();
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateName();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // Méthode utilitaire pour mettre à jour le nom complet
    private void updateName() {
        this.name = this.firstName + " " + this.lastName;
    }
} 