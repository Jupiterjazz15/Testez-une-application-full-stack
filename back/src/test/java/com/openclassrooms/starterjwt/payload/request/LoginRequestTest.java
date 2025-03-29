package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    @Test
    void testEmailGetterSetter() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        assertEquals("test@example.com", loginRequest.getEmail());
    }

    @Test
    void testPasswordGetterSetter() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPassword("securePassword123");
        assertEquals("securePassword123", loginRequest.getPassword());
    }

    @Test
    void testFullObject() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("mypassword");

        assertAll(
                () -> assertEquals("user@example.com", loginRequest.getEmail()),
                () -> assertEquals("mypassword", loginRequest.getPassword())
        );
    }
}
