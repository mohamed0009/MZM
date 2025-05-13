package com.pharmasys.mobile.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import java.util.*

@Entity(tableName = "events")
data class Event(
    @PrimaryKey
    @SerializedName("id")
    val id: Long = 0,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("type")
    val type: String,
    
    @SerializedName("startDate")
    val startDate: Date,
    
    @SerializedName("endDate")
    val endDate: Date,
    
    @SerializedName("createdAt")
    val createdAt: Date,
    
    @SerializedName("updatedAt")
    val updatedAt: Date
)
