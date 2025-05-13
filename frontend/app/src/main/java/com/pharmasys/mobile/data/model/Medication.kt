package com.pharmasys.mobile.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import java.util.*

@Entity(tableName = "medications")
data class Medication(
    @PrimaryKey
    @SerializedName("id")
    val id: Long = 0,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("category")
    val category: String,
    
    @SerializedName("price")
    val price: Double,
    
    @SerializedName("stock")
    val stock: Int,
    
    @SerializedName("expiryDate")
    val expiryDate: Date,
    
    @SerializedName("manufacturer")
    val manufacturer: String,
    
    @SerializedName("createdAt")
    val createdAt: Date,
    
    @SerializedName("updatedAt")
    val updatedAt: Date
)
