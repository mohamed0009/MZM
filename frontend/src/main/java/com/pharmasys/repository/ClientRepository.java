package com.pharmasys.repository;

import com.pharmasys.model.Client;
import com.pharmasys.model.ClientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByStatus(ClientStatus status);
    
    List<Client> findByHasPrescription(boolean hasPrescription);
    
    List<Client> findByNameContainingIgnoreCase(String name);
    
    List<Client> findByEmailContainingIgnoreCase(String email);
}
