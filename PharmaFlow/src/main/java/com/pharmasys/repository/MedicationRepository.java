package com.pharmasys.repository;

import com.pharmasys.model.Medication;
import com.pharmasys.model.MedicationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByCategory(MedicationCategory category);
    
    List<Medication> findByStockLessThanEqual(Integer threshold);
    
    List<Medication> findByExpiryDateBefore(LocalDate date);
    
    @Query("SELECT m FROM Medication m WHERE m.stock <= m.threshold")
    List<Medication> findLowStockMedications();
    
    @Query("SELECT m FROM Medication m WHERE m.expiryDate <= ?1")
    List<Medication> findExpiringMedications(LocalDate date);
}
