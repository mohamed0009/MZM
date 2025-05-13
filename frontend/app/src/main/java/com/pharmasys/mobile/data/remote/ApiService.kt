package com.pharmasys.mobile.data.remote

import com.pharmasys.mobile.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // Auth endpoints
    @POST("auth/signin")
    suspend fun login(@Body loginRequest: LoginRequest): Response<JwtResponse>

    @POST("auth/signup")
    suspend fun signup(@Body signupRequest: SignupRequest): Response<MessageResponse>

    // User endpoints
    @GET("users")
    suspend fun getAllUsers(): Response<List<User>>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: Long): Response<User>

    // Medication endpoints
    @GET("medications")
    suspend fun getAllMedications(): Response<List<Medication>>

    @GET("medications/{id}")
    suspend fun getMedicationById(@Path("id") id: Long): Response<Medication>

    @POST("medications")
    suspend fun createMedication(@Body medication: Medication): Response<Medication>

    @PUT("medications/{id}")
    suspend fun updateMedication(@Path("id") id: Long, @Body medication: Medication): Response<Medication>

    @DELETE("medications/{id}")
    suspend fun deleteMedication(@Path("id") id: Long): Response<MessageResponse>

    // Client endpoints
    @GET("clients")
    suspend fun getAllClients(): Response<List<Client>>

    @GET("clients/{id}")
    suspend fun getClientById(@Path("id") id: Long): Response<Client>

    @POST("clients")
    suspend fun createClient(@Body client: Client): Response<Client>

    @PUT("clients/{id}")
    suspend fun updateClient(@Path("id") id: Long, @Body client: Client): Response<Client>

    @DELETE("clients/{id}")
    suspend fun deleteClient(@Path("id") id: Long): Response<MessageResponse>

    // Alert endpoints
    @GET("alerts")
    suspend fun getAllAlerts(): Response<List<Alert>>

    @GET("alerts/{id}")
    suspend fun getAlertById(@Path("id") id: Long): Response<Alert>

    @POST("alerts")
    suspend fun createAlert(@Body alert: Alert): Response<Alert>

    @PUT("alerts/{id}")
    suspend fun updateAlert(@Path("id") id: Long, @Body alert: Alert): Response<Alert>

    @DELETE("alerts/{id}")
    suspend fun deleteAlert(@Path("id") id: Long): Response<MessageResponse>

    // Event endpoints
    @GET("events")
    suspend fun getAllEvents(): Response<List<Event>>

    @GET("events/{id}")
    suspend fun getEventById(@Path("id") id: Long): Response<Event>

    @POST("events")
    suspend fun createEvent(@Body event: Event): Response<Event>

    @PUT("events/{id}")
    suspend fun updateEvent(@Path("id") id: Long, @Body event: Event): Response<Event>

    @DELETE("events/{id}")
    suspend fun deleteEvent(@Path("id") id: Long): Response<MessageResponse>
}
