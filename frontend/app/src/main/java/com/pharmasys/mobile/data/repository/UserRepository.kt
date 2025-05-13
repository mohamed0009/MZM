package com.pharmasys.mobile.data.repository

import androidx.lifecycle.LiveData
import com.pharmasys.mobile.data.local.UserDao
import com.pharmasys.mobile.data.model.User
import com.pharmasys.mobile.data.remote.ApiService
import com.pharmasys.mobile.utils.NetworkBoundResource
import com.pharmasys.mobile.utils.Resource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserRepository(
    private val apiService: ApiService,
    private val userDao: UserDao
) {
    fun getUsers(): LiveData<Resource<List<User>>> {
        return object : NetworkBoundResource<List<User>, List<User>>() {
            override fun loadFromDb(): LiveData<List<User>> {
                return userDao.getAllUsers()
            }

            override suspend fun createCall() = apiService.getAllUsers()

            override suspend fun saveCallResult(data: List<User>) {
                userDao.insertAll(data)
            }
        }.asLiveData()
    }

    fun getUserById(id: Long): LiveData<Resource<User>> {
        return object : NetworkBoundResource<User, User>() {
            override fun loadFromDb(): LiveData<User> {
                return userDao.getUserById(id)
            }

            override suspend fun createCall() = apiService.getUserById(id)

            override suspend fun saveCallResult(data: User) {
                userDao.insert(data)
            }
        }.asLiveData()
    }

    suspend fun refreshUsers() {
        withContext(Dispatchers.IO) {
            val response = apiService.getAllUsers()
            if (response.isSuccessful) {
                response.body()?.let {
                    userDao.insertAll(it)
                }
            }
        }
    }
}
