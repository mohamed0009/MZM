package com.mzm.pharmaflow.controller;

import com.mzm.pharmaflow.dto.ClientDTO;
import com.mzm.pharmaflow.dto.ResponseDTO;
import com.mzm.pharmaflow.model.ClientStatus;
import com.mzm.pharmaflow.service.ClientService;
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
@RequestMapping("/api/clients")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ClientController {
    
    @Autowired
    private ClientService clientService;
    
    /**
     * Get all clients
     * @return list of all clients
     */
    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        List<ClientDTO> clients = clientService.findAll();
        return ResponseEntity.ok(clients);
    }
    
    /**
     * Get client by ID
     * @param id client ID
     * @return client with the specified ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        ClientDTO client = clientService.findById(id);
        return ResponseEntity.ok(client);
    }
    
    /**
     * Create a new client
     * @param clientDTO client data
     * @return created client
     */
    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@Valid @RequestBody ClientDTO clientDTO) {
        ClientDTO createdClient = clientService.save(clientDTO);
        return ResponseEntity.ok(createdClient);
    }
    
    /**
     * Update an existing client
     * @param id client ID
     * @param clientDTO updated client data
     * @return updated client
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @Valid @RequestBody ClientDTO clientDTO) {
        clientDTO.setId(id);
        ClientDTO updatedClient = clientService.save(clientDTO);
        return ResponseEntity.ok(updatedClient);
    }
    
    /**
     * Delete a client
     * @param id client ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteClient(@PathVariable Long id) {
        clientService.deleteById(id);
        return ResponseEntity.ok(new ResponseDTO(true, "Client deleted successfully"));
    }
    
    /**
     * Search clients by name
     * @param name name to search for
     * @return list of matching clients
     */
    @GetMapping("/search")
    public ResponseEntity<List<ClientDTO>> searchClients(@RequestParam String name) {
        List<ClientDTO> clients = clientService.findByName(name);
        return ResponseEntity.ok(clients);
    }
    
    /**
     * Get clients by status
     * @param status client status
     * @return list of clients with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ClientDTO>> getClientsByStatus(@PathVariable String status) {
        List<ClientDTO> clients = clientService.findByStatus(status);
        return ResponseEntity.ok(clients);
    }
    
    /**
     * Get clients with prescription
     * @return list of clients with prescription
     */
    @GetMapping("/with-prescription")
    public ResponseEntity<List<ClientDTO>> getClientsWithPrescription() {
        List<ClientDTO> clients = clientService.findWithPrescription();
        return ResponseEntity.ok(clients);
    }
    
    /**
     * Get all client statuses
     * @return list of all client statuses
     */
    @GetMapping("/statuses")
    public ResponseEntity<List<Map<String, Object>>> getAllStatuses() {
        List<Map<String, Object>> statuses = Arrays.stream(ClientStatus.values())
            .map(status -> {
                Map<String, Object> statusMap = new HashMap<>();
                statusMap.put("name", status.name());
                statusMap.put("label", status.name().toLowerCase());
                return statusMap;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(statuses);
    }
    
    /**
     * Get clients statistics
     * @return clients statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getClientStats() {
        Map<String, Object> stats = clientService.getStats();
        return ResponseEntity.ok(stats);
    }
} 