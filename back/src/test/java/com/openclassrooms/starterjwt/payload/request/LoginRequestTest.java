package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class LoginRequestTest {

    private LoginRequest createLoginRequest(String email, String password) {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);
        return loginRequest;
    }

    @Test
    public void testLoginRequestWithValidFields() {
        LoginRequest loginRequest = createLoginRequest("test@example.com", "password123");

        assertEquals("test@example.com", loginRequest.getEmail());
        assertEquals("password123", loginRequest.getPassword());
    }

    @Test
    public void testLoginRequestWithInvalidEmail() {
        LoginRequest loginRequest = createLoginRequest("invalid-email", "password123");

        assertEquals("invalid-email", loginRequest.getEmail());
        assertEquals("password123", loginRequest.getPassword());
    }

    @Test
    public void testLoginRequestWithBlankFields() {
        LoginRequest loginRequest = createLoginRequest("", "");

        assertEquals("", loginRequest.getEmail());
        assertEquals("", loginRequest.getPassword());
    }

    @Test
    public void testLoginRequestWithLongPassword() {
        LoginRequest loginRequest = createLoginRequest("test@example.com", "thispasswordiswaytoolongandshouldfailvalidation");

        assertEquals("thispasswordiswaytoolongandshouldfailvalidation", loginRequest.getPassword());
        assertEquals("test@example.com", loginRequest.getEmail());
    }

    @Test
    public void testLoginRequestGettersAndSetters() {
        LoginRequest loginRequest = createLoginRequest("user@example.com", "securepassword");

        assertEquals("user@example.com", loginRequest.getEmail());
        assertEquals("securepassword", loginRequest.getPassword());
    }

    @Test
    public void testConstructorWithAllFields() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");

        assertEquals("test@example.com", loginRequest.getEmail());
        assertEquals("password123", loginRequest.getPassword());
    }

}
