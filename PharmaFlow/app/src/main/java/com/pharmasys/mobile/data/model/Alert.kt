package com.pharmasys.mobile.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import java.util.*

@Entity(tableName = "alerts")
data class Alert(
    @PrimaryKey
    @SerializedName("id")
    val id: Long = 0,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("message")
    val message: String,
    
    @SerializedName("category")
    val category: String,
    
    @SerializedName("priority")
    val priority: String,
    
    @SerializedName("isRead")
    val isRead: Boolean,
    
    @SerializedName("createdAt")
    val createdAt: Date,
    
    @SerializedName("updatedAt")
    val updatedAt: Date
)
