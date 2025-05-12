package com.pharmasys.mobile.data.repository

import androidx.lifecycle.LiveData
import com.pharmasys.mobile.data.local.AlertDao
import com.pharmasys.mobile.data.model.Alert
import com.pharmasys.mobile.data.model.MessageResponse
import com.pharmasys.mobile.data.remote.ApiService
import com.pharmasys.mobile.utils.NetworkBoundResource
import com.pharmasys.mobile.utils.Resource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response

class AlertRepository(
    private val apiService: ApiService,
    private val alertDao: AlertDao
) {
    fun getAlerts(): LiveData<Resource<List<Alert>>> {
        return object : NetworkBoundResource<List<Alert>, List<Alert>>() {
            override fun loadFromDb(): LiveData<List<Alert>> {
                return alertDao.getAllAlerts()
            }

            override suspend fun createCall() = apiService.getAllAlerts()

            override suspend fun saveCallResult(data: List<Alert>) {
                alertDao.insertAll(data)
            }
        }.asLiveData()
    }

    fun getAlertById(id: Long): LiveData<Resource<Alert>> {
        return object : NetworkBoundResource<Alert, Alert>() {
            override fun loadFromDb(): LiveData<Alert> {
                return alertDao.getAlertById(id)
            }

            override suspend fun createCall() = apiService.getAlertById(id)

            override suspend fun saveCallResult(data: Alert) {
                alertDao.insert(data)
            }
        }.asLiveData()
    }

    suspend fun createAlert(alert: Alert): Response<Alert> {
        return withContext(Dispatchers.IO) {
            val response = apiService.createAlert(alert)
            if (response.isSuccessful) {
                response.body()?.let {
                    alertDao.insert(it)
                }
            }
            response
        }
    }

    suspend fun updateAlert(alert: Alert): Response<Alert> {
        return withContext(Dispatchers.IO) {
            val response = apiService.updateAlert(alert.id, alert)
            if (response.isSuccessful) {
                response.body()?.let {
                    alertDao.update(it)
                }
            }
            response
        }
    }

    suspend fun deleteAlert(id: Long): Response<MessageResponse> {
        return withContext(Dispatchers.IO) {
            val response = apiService.deleteAlert(id)
            if (response.isSuccessful) {
                alertDao.getAlertById(id).value?.let {
                    alertDao.delete(it)
                }
            }
            response
        }
    }

    suspend fun refreshAlerts() {
        withContext(Dispatchers.IO) {
            val response = apiService.getAllAlerts()
            if (response.isSuccessful) {
                response.body()?.let {
                    alertDao.insertAll(it)
                }
            }
        }
    }
}
