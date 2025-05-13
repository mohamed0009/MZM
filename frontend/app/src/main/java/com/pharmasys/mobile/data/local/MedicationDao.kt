package com.pharmasys.mobile.data.local

import androidx.lifecycle.LiveData
import androidx.room.*
import com.pharmasys.mobile.data.model.Medication

@Dao
interface MedicationDao {
    @Query("SELECT * FROM medications")
    fun getAllMedications(): LiveData<List<Medication>>

    @Query("SELECT * FROM medications WHERE id = :id")
    fun getMedicationById(id: Long): LiveData<Medication>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(medications: List<Medication>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(medication: Medication)

    @Update
    suspend fun update(medication: Medication)

    @Delete
    suspend fun delete(medication: Medication)

    @Query("DELETE FROM medications")
    suspend fun deleteAll()
}
