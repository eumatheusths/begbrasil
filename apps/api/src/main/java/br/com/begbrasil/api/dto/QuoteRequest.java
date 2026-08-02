package br.com.begbrasil.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public class QuoteRequest {
    
    @NotBlank(message = "O nome é obrigatório")
    private String name;
    
    private String company;
    
    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    private String whatsapp;
    private String city;
    private String state;
    private String industry;
    private String jobTitle;

    @NotBlank(message = "A categoria é obrigatória")
    private String category;
    
    private String material;
    private String applicationEnv;
    private String surface;
    private String dimensions;
    private String format;
    private Integer quantity;
    private String fixationType;
    private Boolean hasNumbering;
    private Boolean hasQrcode;
    private Boolean hasBarcode;
    private String colors;
    private String desiredLeadTime;
    private String notes;
    private Map<String, String> utms;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public String getApplicationEnv() { return applicationEnv; }
    public void setApplicationEnv(String applicationEnv) { this.applicationEnv = applicationEnv; }
    public String getSurface() { return surface; }
    public void setSurface(String surface) { this.surface = surface; }
    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getFixationType() { return fixationType; }
    public void setFixationType(String fixationType) { this.fixationType = fixationType; }
    public Boolean getHasNumbering() { return hasNumbering; }
    public void setHasNumbering(Boolean hasNumbering) { this.hasNumbering = hasNumbering; }
    public Boolean getHasQrcode() { return hasQrcode; }
    public void setHasQrcode(Boolean hasQrcode) { this.hasQrcode = hasQrcode; }
    public Boolean getHasBarcode() { return hasBarcode; }
    public void setHasBarcode(Boolean hasBarcode) { this.hasBarcode = hasBarcode; }
    public String getColors() { return colors; }
    public void setColors(String colors) { this.colors = colors; }
    public String getDesiredLeadTime() { return desiredLeadTime; }
    public void setDesiredLeadTime(String desiredLeadTime) { this.desiredLeadTime = desiredLeadTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Map<String, String> getUtms() { return utms; }
    public void setUtms(Map<String, String> utms) { this.utms = utms; }
}
