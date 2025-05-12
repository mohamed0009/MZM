package com.mzm.pharmaflow.service;

import com.mzm.pharmaflow.dto.ClientDTO;

import java.util.List;

public interface ClientService {
    List<ClientDTO> findAll();
    
    ClientDTO findById(Long id);
    
    ClientDTO save(ClientDTO clientDTO);
    
    ClientDTO update(ClientDTO clientDTO);
    
    void delete(Long id);
    
    List<ClientDTO> search(String query);
} 