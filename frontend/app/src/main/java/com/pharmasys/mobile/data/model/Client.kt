package com.pharmasys.mobile.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import java.util.*

@Entity(tableName = "clients")
data class Client(
    @PrimaryKey
    @SerializedName("id")
    val id: Long = 0,
    
    @SerializedName("firstName")
    val firstName: String,
    
    @SerializedName("lastName")
    val lastName: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("phone")
    val phone: String,
    
    @SerializedName("address")
    val address: String,
    
    @SerializedName("status")
    val status: String,
    
    @SerializedName("dateOfBirth")
    val dateOfBirth: Date,
    
    @SerializedName("createdAt")
    val createdAt: Date,
    
    @SerializedName("updatedAt")
    val updatedAt: Date
)
