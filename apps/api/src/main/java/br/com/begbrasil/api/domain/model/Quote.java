package br.com.begbrasil.api.domain.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "quotes")
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String protocol;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status = QuoteStatus.RECEIVED;

    // Etapa 2 - Produto
    private String category;
    private String material;
    @Column(name = "application_env")
    private String applicationEnv;
    private String surface;
    private String dimensions;
    private String format;
    private Integer quantity;
    @Column(name = "fixation_type")
    private String fixationType;
    private Boolean hasNumbering = false;
    private Boolean hasQrcode = false;
    private Boolean hasBarcode = false;
    private String colors;
    private String desiredLeadTime;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuoteAttachment> attachments = new ArrayList<>();

    @OneToOne(mappedBy = "quote", cascade = CascadeType.ALL)
    private UTMData utmData;

    @Column(updatable = false)
    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
        if (this.protocol == null) {
            this.protocol = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public void addAttachment(QuoteAttachment attachment) {
        attachments.add(attachment);
        attachment.setQuote(this);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }
    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }
    public QuoteStatus getStatus() { return status; }
    public void setStatus(QuoteStatus status) { this.status = status; }
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
    public List<QuoteAttachment> getAttachments() { return attachments; }
    public void setAttachments(List<QuoteAttachment> attachments) { this.attachments = attachments; }
    public UTMData getUtmData() { return utmData; }
    public void setUtmData(UTMData utmData) { 
        this.utmData = utmData; 
        if(utmData != null) utmData.setQuote(this);
    }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
