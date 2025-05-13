package com.pharmasys.controller;

import com.pharmasys.model.Client;
import com.pharmasys.model.ClientStatus;
import com.pharmasys.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    ClientRepository clientRepository;

    @GetMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<Client> getClientById(@PathVariable("id") long id) {
        Optional<Client> clientData = clientRepository.findById(id);

        if (clientData.isPresent()) {
            return new ResponseEntity<>(clientData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Client>> getClientsByStatus(@PathVariable("status") String status) {
        try {
            ClientStatus clientStatus = ClientStatus.valueOf(status.toUpperCase());
            List<Client> clients = clientRepository.findByStatus(clientStatus);
            return new ResponseEntity<>(clients, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/prescription")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Client>> getClientsWithPrescription() {
        List<Client> clients = clientRepository.findByHasPrescription(true);
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Client>> searchClients(@RequestParam(required = false) String name, @RequestParam(required = false) String email) {
        if (name != null && !name.isEmpty()) {
            return new ResponseEntity<>(clientRepository.findByNameContainingIgnoreCase(name), HttpStatus.OK);
        } else if (email != null && !email.isEmpty()) {
            return new ResponseEntity<>(clientRepository.findByEmailContainingIgnoreCase(email), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(clientRepository.findAll(), HttpStatus.OK);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) {
        try {
            Client _client = clientRepository.save(client);
            return new ResponseEntity<>(_client, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Client> updateClient(@PathVariable("id") long id, @Valid @RequestBody Client client) {
        Optional<Client> clientData = clientRepository.findById(id);

        if (clientData.isPresent()) {
            Client _client = clientData.get();
            _client.setName(client.getName());
            _client.setEmail(client.getEmail());
            _client.setPhone(client.getPhone());
            _client.setBirthDate(client.getBirthDate());
            _client.setLastVisit(client.getLastVisit());
            _client.setStatus(client.getStatus());
            _client.setHasPrescription(client.isHasPrescription());
            _client.setAvatar(client.getAvatar());
            return new ResponseEntity<>(clientRepository.save(_client), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteClient(@PathVariable("id") long id) {
        try {
            clientRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
