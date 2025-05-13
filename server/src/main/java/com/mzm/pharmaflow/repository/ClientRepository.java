package com.mzm.pharmaflow.repository;

import com.mzm.pharmaflow.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    /**
     * Find clients by status
     * @param status client status
     * @return list of clients with the specified status
     */
    List<Client> findByStatus(String status);
    
    /**
     * Search clients by name
     * @param name name to search for
     * @return list of matching clients
     */
    List<Client> findByNameContainingIgnoreCase(String name);
    
    /**
     * Search clients by email
     * @param email email to search for
     * @return client with the email
     */
    Client findByEmail(String email);
    
    /**
     * Search clients by phone
     * @param phone phone number to search for
     * @return client with the phone number
     */
    Client findByPhone(String phone);
    
    /**
     * Find clients with prescription
     * @return list of clients with prescription
     */
    List<Client> findByHasPrescriptionTrue();
} 