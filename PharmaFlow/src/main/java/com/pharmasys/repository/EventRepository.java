package com.pharmasys.repository;

import com.pharmasys.model.Event;
import com.pharmasys.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDate(LocalDate date);
    
    List<Event> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Event> findByType(EventType type);
    
    List<Event> findByClientContainingIgnoreCase(String client);
}
