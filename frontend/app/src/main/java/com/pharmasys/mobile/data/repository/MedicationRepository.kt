package com.pharmasys.mobile.data.repository

import androidx.lifecycle.LiveData
import com.pharmasys.mobile.data.local.MedicationDao
import com.pharmasys.mobile.data.model.Medication
import com.pharmasys.mobile.data.model.MessageResponse
import com.pharmasys.mobile.data.remote.ApiService
import com.pharmasys.mobile.utils.NetworkBoundResource
import com.pharmasys.mobile.utils.Resource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response

class MedicationRepository(
    private val apiService: ApiService,
    private val medicationDao: MedicationDao
) {
    fun getMedications(): LiveData<Resource<List<Medication>>> {
        return object : NetworkBoundResource<List<Medication>, List<Medication>>() {
            override fun loadFromDb(): LiveData<List<Medication>> {
                return medicationDao.getAllMedications()
            }

            override suspend fun createCall() = apiService.getAllMedications()

            override suspend fun saveCallResult(data: List<Medication>) {
                medicationDao.insertAll(data)
            }
        }.asLiveData()
    }

    fun getMedicationById(id: Long): LiveData<Resource<Medication>> {
        return object : NetworkBoundResource<Medication, Medication>() {
            override fun loadFromDb(): LiveData<Medication> {
                return medicationDao.getMedicationById(id)
            }

            override suspend fun createCall() = apiService.getMedicationById(id)

            override suspend fun saveCallResult(data: Medication) {
                medicationDao.insert(data)
            }
        }.asLiveData()
    }

    suspend fun createMedication(medication: Medication): Response<Medication> {
        return withContext(Dispatchers.IO) {
            val response = apiService.createMedication(medication)
            if (response.isSuccessful) {
                response.body()?.let {
                    medicationDao.insert(it)
                }
            }
            response
        }
    }

    suspend fun updateMedication(medication: Medication): Response<Medication> {
        return withContext(Dispatchers.IO) {
            val response = apiService.updateMedication(medication.id, medication)
            if (response.isSuccessful) {
                response.body()?.let {
                    medicationDao.update(it)
                }
            }
            response
        }
    }

    suspend fun deleteMedication(id: Long): Response<MessageResponse> {
        return withContext(Dispatchers.IO) {
            val response = apiService.deleteMedication(id)
            if (response.isSuccessful) {
                medicationDao.getMedicationById(id).value?.let {
                    medicationDao.delete(it)
                }
            }
            response
        }
    }

    suspend fun refreshMedications() {
        withContext(Dispatchers.IO) {
            val response = apiService.getAllMedications()
            if (response.isSuccessful) {
                response.body()?.let {
                    medicationDao.insertAll(it)
                }
            }
        }
    }
}
