package com.pharmasys.controller;

import com.pharmasys.model.Alert;
import com.pharmasys.model.AlertCategory;
import com.pharmasys.model.AlertPriority;
import com.pharmasys.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/alerts")
public class AlertController {
    @Autowired
    AlertRepository alertRepository;

    @GetMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Alert>> getAllAlerts() {
        List<Alert> alerts = alertRepository.findAll();
        return new ResponseEntity<>(alerts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<Alert> getAlertById(@PathVariable("id") long id) {
        Optional<Alert> alertData = alertRepository.findById(id);

        if (alertData.isPresent()) {
            return new ResponseEntity<>(alertData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Alert>> getAlertsByCategory(@PathVariable("category") String category) {
        try {
            AlertCategory alertCategory = AlertCategory.valueOf(category.toUpperCase());
            List<Alert> alerts = alertRepository.findByCategory(alertCategory);
            return new ResponseEntity<>(alerts, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Alert>> getAlertsByPriority(@PathVariable("priority") String priority) {
        try {
            AlertPriority alertPriority = AlertPriority.valueOf(priority.toUpperCase());
            List<Alert> alerts = alertRepository.findByPriority(alertPriority);
            return new ResponseEntity<>(alerts, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/unread")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Alert>> getUnreadAlerts() {
        List<Alert> alerts = alertRepository.findByRead(false);
        return new ResponseEntity<>(alerts, HttpStatus.OK);
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<Map<String, Long>> getAlertCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("total", alertRepository.count());
        counts.put("unread", alertRepository.countByRead(false));
        return new ResponseEntity<>(counts, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Alert> createAlert(@Valid @RequestBody Alert alert) {
        try {
            Alert _alert = alertRepository.save(alert);
            return new ResponseEntity<>(_alert, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Alert> updateAlert(@PathVariable("id") long id, @Valid @RequestBody Alert alert) {
        Optional<Alert> alertData = alertRepository.findById(id);

        if (alertData.isPresent()) {
            Alert _alert = alertData.get();
            _alert.setTitle(alert.getTitle());
            _alert.setDescription(alert.getDescription());
            _alert.setCategory(alert.getCategory());
            _alert.setPriority(alert.getPriority());
            _alert.setRead(alert.isRead());
            return new ResponseEntity<>(alertRepository.save(_alert), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<Alert> markAlertAsRead(@PathVariable("id") long id) {
        Optional<Alert> alertData = alertRepository.findById(id);

        if (alertData.isPresent()) {
            Alert _alert = alertData.get();
            _alert.setRead(true);
            return new ResponseEntity<>(alertRepository.save(_alert), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/read-all")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<HttpStatus> markAllAlertsAsRead() {
        try {
            List<Alert> unreadAlerts = alertRepository.findByRead(false);
            for (Alert alert : unreadAlerts) {
                alert.setRead(true);
                alertRepository.save(alert);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteAlert(@PathVariable("id") long id) {
        try {
            alertRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
