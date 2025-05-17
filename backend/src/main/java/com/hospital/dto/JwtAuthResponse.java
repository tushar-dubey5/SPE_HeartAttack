package com.hospital.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import com.hospital.model.User;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonDeserialize(builder = JwtAuthResponse.JwtAuthResponseBuilder.class)
public class JwtAuthResponse {
    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private String username;
    private String email;
    private User.Role role;
    private Long userId;
    private Long doctorId;
    private Long patientId;

    @JsonPOJOBuilder(withPrefix = "")
    public static class JwtAuthResponseBuilder {
    }
}
