package com.pharmasys.mobile.data.repository

import androidx.lifecycle.LiveData
import com.pharmasys.mobile.data.local.ClientDao
import com.pharmasys.mobile.data.model.Client
import com.pharmasys.mobile.data.model.MessageResponse
import com.pharmasys.mobile.data.remote.ApiService
import com.pharmasys.mobile.utils.NetworkBoundResource
import com.pharmasys.mobile.utils.Resource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response

class ClientRepository(
    private val apiService: ApiService,
    private val clientDao: ClientDao
) {
    fun getClients(): LiveData<Resource<List<Client>>> {
        return object : NetworkBoundResource<List<Client>, List<Client>>() {
            override fun loadFromDb(): LiveData<List<Client>> {
                return clientDao.getAllClients()
            }

            override suspend fun createCall() = apiService.getAllClients()

            override suspend fun saveCallResult(data: List<Client>) {
                clientDao.insertAll(data)
            }
        }.asLiveData()
    }

    fun getClientById(id: Long): LiveData<Resource<Client>> {
        return object : NetworkBoundResource<Client, Client>() {
            override fun loadFromDb(): LiveData<Client> {
                return clientDao.getClientById(id)
            }

            override suspend fun createCall() = apiService.getClientById(id)

            override suspend fun saveCallResult(data: Client) {
                clientDao.insert(data)
            }
        }.asLiveData()
    }

    suspend fun createClient(client: Client): Response<Client> {
        return withContext(Dispatchers.IO) {
            val response = apiService.createClient(client)
            if (response.isSuccessful) {
                response.body()?.let {
                    clientDao.insert(it)
                }
            }
            response
        }
    }

    suspend fun updateClient(client: Client): Response<Client> {
        return withContext(Dispatchers.IO) {
            val response = apiService.updateClient(client.id, client)
            if (response.isSuccessful) {
                response.body()?.let {
                    clientDao.update(it)
                }
            }
            response
        }
    }

    suspend fun deleteClient(id: Long): Response<MessageResponse> {
        return withContext(Dispatchers.IO) {
            val response = apiService.deleteClient(id)
            if (response.isSuccessful) {
                clientDao.getClientById(id).value?.let {
                    clientDao.delete(it)
                }
            }
            response
        }
    }

    suspend fun refreshClients() {
        withContext(Dispatchers.IO) {
            val response = apiService.getAllClients()
            if (response.isSuccessful) {
                response.body()?.let {
                    clientDao.insertAll(it)
                }
            }
        }
    }
}
