package com.mzm.pharmaflow.repository;

import com.mzm.pharmaflow.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
     * Search clients by first name or last name
     * @param name name to search for
     * @return list of matching clients
     */
    @Query("SELECT c FROM Client c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Client> findByNameContainingIgnoreCase(@Param("name") String name);
    
    /**
     * Search clients by first name
     * @param firstName first name to search for
     * @return list of clients with matching first name
     */
    List<Client> findByFirstNameContainingIgnoreCase(String firstName);
    
    /**
     * Search clients by last name
     * @param lastName last name to search for
     * @return list of clients with matching last name
     */
    List<Client> findByLastNameContainingIgnoreCase(String lastName);
    
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