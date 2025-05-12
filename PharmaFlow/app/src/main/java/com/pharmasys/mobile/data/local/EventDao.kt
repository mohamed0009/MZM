package com.pharmasys.mobile.data.local

import androidx.lifecycle.LiveData
import androidx.room.*
import com.pharmasys.mobile.data.model.Event
import java.util.*

@Dao
interface EventDao {
    @Query("SELECT * FROM events ORDER BY startDate ASC")
    fun getAllEvents(): LiveData<List<Event>>

    @Query("SELECT * FROM events WHERE id = :id")
    fun getEventById(id: Long): LiveData<Event>

    @Query("SELECT * FROM events WHERE startDate BETWEEN :start AND :end ORDER BY startDate ASC")
    fun getEventsBetweenDates(start: Date, end: Date): LiveData<List<Event>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(events: List<Event>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(event: Event)

    @Update
    suspend fun update(event: Event)

    @Delete
    suspend fun delete(event: Event)

    @Query("DELETE FROM events")
    suspend fun deleteAll()
}
