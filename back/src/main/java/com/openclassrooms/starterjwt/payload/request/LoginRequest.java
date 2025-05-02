package com.openclassrooms.starterjwt.payload.request;

import javax.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    // Constructeur sans argument
    public LoginRequest() {}

    // Constructeur avec arguments
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getter pour email
    public String getEmail() {
        return email;
    }

    // Setter pour email
    public void setEmail(String email) {
        this.email = email;
    }

    // Getter pour password
    public String getPassword() {
        return password;
    }

    // Setter pour password
    public void setPassword(String password) {
        this.password = password;
    }
}
