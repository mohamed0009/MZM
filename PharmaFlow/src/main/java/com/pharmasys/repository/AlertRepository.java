package com.pharmasys.repository;

import com.pharmasys.model.Alert;
import com.pharmasys.model.AlertCategory;
import com.pharmasys.model.AlertPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByCategory(AlertCategory category);
    
    List<Alert> findByPriority(AlertPriority priority);
    
    List<Alert> findByRead(boolean read);
    
    List<Alert> findByCategoryAndRead(AlertCategory category, boolean read);
    
    List<Alert> findByPriorityAndRead(AlertPriority priority, boolean read);
    
    long countByRead(boolean read);
}
