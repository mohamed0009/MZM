package com.pharmasys.mobile.data.local

import androidx.lifecycle.LiveData
import androidx.room.*
import com.pharmasys.mobile.data.model.Alert

@Dao
interface AlertDao {
    @Query("SELECT * FROM alerts ORDER BY createdAt DESC")
    fun getAllAlerts(): LiveData<List<Alert>>

    @Query("SELECT * FROM alerts WHERE id = :id")
    fun getAlertById(id: Long): LiveData<Alert>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(alerts: List<Alert>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(alert: Alert)

    @Update
    suspend fun update(alert: Alert)

    @Delete
    suspend fun delete(alert: Alert)

    @Query("DELETE FROM alerts")
    suspend fun deleteAll()
}
