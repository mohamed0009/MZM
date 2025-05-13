package com.mzm.pharmaflow.service;

import com.mzm.pharmaflow.dto.ClientDTO;

import java.util.List;
import java.util.Map;

public interface ClientService {
    
    /**
     * Find all clients
     * @return list of all clients
     */
    List<ClientDTO> findAll();
    
    /**
     * Find client by ID
     * @param id client ID
     * @return client with the specified ID
     */
    ClientDTO findById(Long id);
    
    /**
     * Save a client (create or update)
     * @param clientDTO client data
     * @return saved client
     */
    ClientDTO save(ClientDTO clientDTO);
    
    /**
     * Delete client by ID
     * @param id client ID
     */
    void deleteById(Long id);
    
    /**
     * Find clients by name
     * @param name name to search for
     * @return list of matching clients
     */
    List<ClientDTO> findByName(String name);
    
    /**
     * Find clients by status
     * @param status client status
     * @return list of clients with the specified status
     */
    List<ClientDTO> findByStatus(String status);
    
    /**
     * Find clients with prescription
     * @return list of clients with prescription
     */
    List<ClientDTO> findWithPrescription();
    
    /**
     * Get clients statistics
     * @return clients statistics
     */
    Map<String, Object> getStats();
} 