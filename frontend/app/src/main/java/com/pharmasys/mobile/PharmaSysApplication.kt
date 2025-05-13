package com.pharmasys.mobile

import android.app.Application
import com.pharmasys.mobile.data.repository.UserRepository
import com.pharmasys.mobile.data.repository.MedicationRepository
import com.pharmasys.mobile.data.repository.ClientRepository
import com.pharmasys.mobile.data.repository.AlertRepository
import com.pharmasys.mobile.data.repository.EventRepository
import com.pharmasys.mobile.data.local.AppDatabase
import com.pharmasys.mobile.data.remote.ApiService
import com.pharmasys.mobile.data.remote.RetrofitClient

class PharmaSysApplication : Application() {

    // Database instance
    private val database by lazy { AppDatabase.getDatabase(this) }
    
    // API Service
    private val apiService by lazy { RetrofitClient.createService(ApiService::class.java) }
    
    // Repositories
    val userRepository by lazy { UserRepository(apiService, database.userDao()) }
    val medicationRepository by lazy { MedicationRepository(apiService, database.medicationDao()) }
    val clientRepository by lazy { ClientRepository(apiService, database.clientDao()) }
    val alertRepository by lazy { AlertRepository(apiService, database.alertDao()) }
    val eventRepository by lazy { EventRepository(apiService, database.eventDao()) }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }

    companion object {
        lateinit var instance: PharmaSysApplication
            private set
    }
}
