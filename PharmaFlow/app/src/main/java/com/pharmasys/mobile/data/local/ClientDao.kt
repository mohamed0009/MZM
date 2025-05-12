package com.pharmasys.mobile.data.local

import androidx.lifecycle.LiveData
import androidx.room.*
import com.pharmasys.mobile.data.model.Client

@Dao
interface ClientDao {
    @Query("SELECT * FROM clients")
    fun getAllClients(): LiveData<List<Client>>

    @Query("SELECT * FROM clients WHERE id = :id")
    fun getClientById(id: Long): LiveData<Client>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(clients: List<Client>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(client: Client)

    @Update
    suspend fun update(client: Client)

    @Delete
    suspend fun delete(client: Client)

    @Query("DELETE FROM clients")
    suspend fun deleteAll()
}
