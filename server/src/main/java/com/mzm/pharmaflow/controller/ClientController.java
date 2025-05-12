package com.mzm.pharmaflow.controller;

import com.mzm.pharmaflow.dto.ClientDTO;
import com.mzm.pharmaflow.dto.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ClientController {

    // Inject service here (code omitted for brevity)
    
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        try {
            List<ClientDTO> clients = clientService.findAll();
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error fetching clients: " + e.getMessage(), e);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable @NotNull Long id) {
        try {
            ClientDTO client = clientService.findById(id);
            return ResponseEntity.ok(client);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Client not found with ID: " + id, e);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClientDTO> createClient(@Valid @RequestBody ClientDTO clientDTO) {
        try {
            ClientDTO createdClient = clientService.save(clientDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Error creating client: " + e.getMessage(), e);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClientDTO> updateClient(
            @PathVariable @NotNull Long id, 
            @Valid @RequestBody ClientDTO clientDTO) {
        try {
            clientDTO.setId(id);
            ClientDTO updatedClient = clientService.update(clientDTO);
            return ResponseEntity.ok(updatedClient);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Error updating client: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO> deleteClient(@PathVariable @NotNull Long id) {
        try {
            clientService.delete(id);
            return ResponseEntity.ok(new ResponseDTO("Client deleted successfully"));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Error deleting client: " + e.getMessage(), e);
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ClientDTO>> searchClients(@RequestParam String query) {
        try {
            List<ClientDTO> clients = clientService.search(query);
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error searching clients: " + e.getMessage(), e);
        }
    }
} 