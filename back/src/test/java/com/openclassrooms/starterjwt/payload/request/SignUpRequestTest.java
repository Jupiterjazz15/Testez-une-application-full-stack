package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SignupRequestTest {

    @Test
    void testGettersAndSetters() {
        SignupRequest request = new SignupRequest();

        request.setEmail("john.doe@example.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("strongPassword123");

        assertEquals("john.doe@example.com", request.getEmail());
        assertEquals("John", request.getFirstName());
        assertEquals("Doe", request.getLastName());
        assertEquals("strongPassword123", request.getPassword());
    }

    @Test
    void testConstructorWithArgs() {
        SignupRequest request = new SignupRequest("jane.doe@example.com", "Jane", "Doe", "securePass456");

        assertEquals("jane.doe@example.com", request.getEmail());
        assertEquals("Jane", request.getFirstName());
        assertEquals("Doe", request.getLastName());
        assertEquals("securePass456", request.getPassword());
    }
}
