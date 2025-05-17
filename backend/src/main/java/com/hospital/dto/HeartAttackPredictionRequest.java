package com.hospital.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;

@Data
public class HeartAttackPredictionRequest {
    @NotNull
    @Min(value = 0, message = "Age must be greater than or equal to 0")
    @Max(value = 120, message = "Age must be less than or equal to 120")
    private Integer age;
    
    @NotNull
    @Min(value = 0, message = "Sex must be 0 (female) or 1 (male)")
    @Max(value = 1, message = "Sex must be 0 (female) or 1 (male)")
    private Integer sex; // 0 = female, 1 = male
    
    @NotNull
    @Min(value = 0, message = "Chest pain type must be between 0 and 3")
    @Max(value = 3, message = "Chest pain type must be between 0 and 3")
    private Integer cp; // chest pain type
    
    @NotNull
    @Min(value = 0, message = "Resting blood pressure must be greater than 0")
    @Max(value = 300, message = "Resting blood pressure must be less than 300")
    private Integer trtbps; // resting blood pressure (renamed from trestbps)
    
    @NotNull
    @Min(value = 0, message = "Cholesterol must be greater than 0")
    @Max(value = 600, message = "Cholesterol must be less than 600")
    private Integer chol; // serum cholesterol
    
    @NotNull
    @Min(value = 0, message = "Fasting blood sugar must be 0 or 1")
    @Max(value = 1, message = "Fasting blood sugar must be 0 or 1")
    private Integer fbs; // fasting blood sugar
    
    @NotNull
    @Min(value = 0, message = "Resting ECG must be between 0 and 2")
    @Max(value = 2, message = "Resting ECG must be between 0 and 2")
    private Integer restecg; // resting ECG results
    
    @NotNull
    @Min(value = 0, message = "Maximum heart rate must be greater than 0")
    @Max(value = 250, message = "Maximum heart rate must be less than 250")
    private Integer thalachh; // maximum heart rate achieved (renamed from thalach)
    
    @NotNull
    @Min(value = 0, message = "Exercise induced angina must be 0 or 1")
    @Max(value = 1, message = "Exercise induced angina must be 0 or 1")
    private Integer exng; // exercise induced angina (renamed from exang)
    
    @NotNull
    @Min(value = 0, message = "ST depression must be greater than or equal to 0")
    @Max(value = 10, message = "ST depression must be less than or equal to 10")
    private Double oldpeak; // ST depression induced by exercise
    
    @NotNull
    @Min(value = 0, message = "Slope must be between 0 and 2")
    @Max(value = 2, message = "Slope must be between 0 and 2")
    private Integer slp; // slope of peak exercise ST segment (renamed from slope)
    
    @NotNull
    @Min(value = 0, message = "Number of major vessels must be between 0 and 4")
    @Max(value = 4, message = "Number of major vessels must be between 0 and 4")
    private Integer caa; // number of major vessels (renamed from ca)
    
    @NotNull
    @Min(value = 0, message = "Thalassemia must be between 0 and 3")
    @Max(value = 3, message = "Thalassemia must be between 0 and 3")
    private Integer thall; // thalassemia (renamed from thal)
} 