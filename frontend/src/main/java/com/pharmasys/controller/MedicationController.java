package com.pharmasys.controller;

import com.pharmasys.model.Medication;
import com.pharmasys.model.MedicationCategory;
import com.pharmasys.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/medications")
public class MedicationController {
    @Autowired
    MedicationRepository medicationRepository;

    @GetMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Medication>> getAllMedications() {
        List<Medication> medications = medicationRepository.findAll();
        return new ResponseEntity<>(medications, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<Medication> getMedicationById(@PathVariable("id") long id) {
        Optional<Medication> medicationData = medicationRepository.findById(id);

        if (medicationData.isPresent()) {
            return new ResponseEntity<>(medicationData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Medication>> getMedicationsByCategory(@PathVariable("category") String category) {
        try {
            MedicationCategory medicationCategory = MedicationCategory.valueOf(category.toUpperCase());
            List<Medication> medications = medicationRepository.findByCategory(medicationCategory);
            return new ResponseEntity<>(medications, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Medication>> getLowStockMedications() {
        List<Medication> medications = medicationRepository.findLowStockMedications();
        return new ResponseEntity<>(medications, HttpStatus.OK);
    }

    @GetMapping("/expiring")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Medication>> getExpiringMedications(@RequestParam(defaultValue = "30") int days) {
        LocalDate expiryDate = LocalDate.now().plusDays(days);
        List<Medication> medications = medicationRepository.findExpiringMedications(expiryDate);
        return new ResponseEntity<>(medications, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Medication> createMedication(@Valid @RequestBody Medication medication) {
        try {
            Medication _medication = medicationRepository.save(medication);
            return new ResponseEntity<>(_medication, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Medication> updateMedication(@PathVariable("id") long id, @Valid @RequestBody Medication medication) {
        Optional<Medication> medicationData = medicationRepository.findById(id);

        if (medicationData.isPresent()) {
            Medication _medication = medicationData.get();
            _medication.setName(medication.getName());
            _medication.setCategory(medication.getCategory());
            _medication.setStock(medication.getStock());
            _medication.setThreshold(medication.getThreshold());
            _medication.setExpiryDate(medication.getExpiryDate());
            _medication.setPrice(medication.getPrice());
            return new ResponseEntity<>(medicationRepository.save(_medication), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteMedication(@PathVariable("id") long id) {
        try {
            medicationRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
