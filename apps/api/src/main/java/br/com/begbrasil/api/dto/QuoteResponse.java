package br.com.begbrasil.api.dto;

public class QuoteResponse {
    private String protocol;
    private String status;
    private String message;

    public QuoteResponse(String protocol, String status, String message) {
        this.protocol = protocol;
        this.status = status;
        this.message = message;
    }

    public String getProtocol() { return protocol; }
    public String getStatus() { return status; }
    public String getMessage() { return message; }
}
