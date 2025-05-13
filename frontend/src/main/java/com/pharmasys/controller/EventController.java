package com.pharmasys.controller;

import com.pharmasys.model.Event;
import com.pharmasys.model.EventType;
import com.pharmasys.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
@RequestMapping("/events")
public class EventController {
    @Autowired
    EventRepository eventRepository;

    @GetMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<Event> getEventById(@PathVariable("id") long id) {
        Optional<Event> eventData = eventRepository.findById(id);

        if (eventData.isPresent()) {
            return new ResponseEntity<>(eventData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Event>> getEventsByDate(@PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Event> events = eventRepository.findByDate(date);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/range")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Event>> getEventsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Event> events = eventRepository.findByDateBetween(startDate, endDate);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Event>> getEventsByType(@PathVariable("type") String type) {
        try {
            EventType eventType = EventType.valueOf(type.toUpperCase());
            List<Event> events = eventRepository.findByType(eventType);
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('ASSISTANT')")
    public ResponseEntity<List<Event>> getEventsByClient(@RequestParam String client) {
        List<Event> events = eventRepository.findByClientContainingIgnoreCase(client);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event) {
        try {
            Event _event = eventRepository.save(event);
            return new ResponseEntity<>(_event, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Event> updateEvent(@PathVariable("id") long id, @Valid @RequestBody Event event) {
        Optional<Event> eventData = eventRepository.findById(id);

        if (eventData.isPresent()) {
            Event _event = eventData.get();
            _event.setTitle(event.getTitle());
            _event.setDescription(event.getDescription());
            _event.setDate(event.getDate());
            _event.setStartTime(event.getStartTime());
            _event.setEndTime(event.getEndTime());
            _event.setType(event.getType());
            _event.setClient(event.getClient());
            return new ResponseEntity<>(eventRepository.save(_event), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteEvent(@PathVariable("id") long id) {
        try {
            eventRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
