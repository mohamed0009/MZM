package com.pharmasys.mobile.data.model

import com.google.gson.annotations.SerializedName

data class JwtResponse(
    @SerializedName("token")
    val token: String,
    
    @SerializedName("type")
    val type: String,
    
    @SerializedName("id")
    val id: Long,
    
    @SerializedName("username")
    val username: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("roles")
    val roles: List<String>
)

data class MessageResponse(
    @SerializedName("message")
    val message: String
)
