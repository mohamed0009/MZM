package com.mzm.pharmaflow.service.impl;

import com.mzm.pharmaflow.dto.ClientDTO;
import com.mzm.pharmaflow.model.Client;
import com.mzm.pharmaflow.model.ClientStatus;
import com.mzm.pharmaflow.repository.ClientRepository;
import com.mzm.pharmaflow.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClientServiceImpl implements ClientService {
    
    @Autowired
    private ClientRepository clientRepository;
    
    /**
     * Convert Client entity to ClientDTO
     * @param client entity to convert
     * @return converted DTO
     */
    private ClientDTO convertToDto(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setName(client.getName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setBirthDate(client.getBirthDate());
        dto.setAddress(client.getAddress());
        dto.setStatus(client.getStatus().name());
        dto.setLastVisit(client.getLastVisit());
        dto.setMedicalNotes(client.getMedicalNotes());
        dto.setHasPrescription(client.getHasPrescription());
        dto.setAvatar(client.getAvatar());
        dto.setCreatedAt(client.getCreatedAt());
        dto.setUpdatedAt(client.getUpdatedAt());
        return dto;
    }
    
    /**
     * Convert ClientDTO to Client entity
     * @param dto DTO to convert
     * @return converted entity
     */
    private Client convertToEntity(ClientDTO dto) {
        Client client = dto.getId() != null
                ? clientRepository.findById(dto.getId())
                        .orElse(new Client())
                : new Client();
        
        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setBirthDate(dto.getBirthDate());
        client.setAddress(dto.getAddress());
        
        if (dto.getStatus() != null) {
            try {
                client.setStatus(ClientStatus.valueOf(dto.getStatus()));
            } catch (IllegalArgumentException e) {
                // Default to NOUVEAU if status is invalid
                client.setStatus(ClientStatus.NOUVEAU);
            }
        } else {
            client.setStatus(ClientStatus.NOUVEAU);
        }
        
        client.setLastVisit(dto.getLastVisit());
        client.setMedicalNotes(dto.getMedicalNotes());
        client.setHasPrescription(dto.getHasPrescription());
        client.setAvatar(dto.getAvatar());
        
        return client;
    }
    
    @Override
    public List<ClientDTO> findAll() {
        return clientRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public ClientDTO findById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));
        return convertToDto(client);
    }
    
    @Override
    public ClientDTO save(ClientDTO clientDTO) {
        Client client = convertToEntity(clientDTO);
        Client savedClient = clientRepository.save(client);
        return convertToDto(savedClient);
    }
    
    @Override
    public void deleteById(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new EntityNotFoundException("Client not found with id: " + id);
        }
        clientRepository.deleteById(id);
    }
    
    @Override
    public List<ClientDTO> findByName(String name) {
        return clientRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ClientDTO> findByStatus(String status) {
        ClientStatus clientStatus;
        try {
            clientStatus = ClientStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid client status: " + status);
        }
        return clientRepository.findByStatus(clientStatus.name()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ClientDTO> findWithPrescription() {
        return clientRepository.findByHasPrescriptionTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get total count
        long totalCount = clientRepository.count();
        stats.put("totalCount", totalCount);
        
        // Get status distribution
        Map<ClientStatus, Long> statusDistribution = new HashMap<>();
        for (ClientStatus status : ClientStatus.values()) {
            long count = clientRepository.findByStatus(status.name()).size();
            statusDistribution.put(status, count);
        }
        stats.put("statusDistribution", statusDistribution);
        
        // Get clients with prescription count
        long withPrescriptionCount = clientRepository.findByHasPrescriptionTrue().size();
        stats.put("withPrescriptionCount", withPrescriptionCount);
        
        // Get new clients in last 30 days
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        long newClientsCount = clientRepository.findAll().stream()
                .filter(client -> client.getCreatedAt() != null && client.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();
        stats.put("newClientsCount", newClientsCount);
        
        return stats;
    }
} 