package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtResponseTest {

    @Test
    public void testConstructorAndGetters() {
        JwtResponse jwtResponse = new JwtResponse(
                "test-token",
                1L,
                "user@example.com",
                "Jean",
                "Dupont",
                true
        );

        assertEquals("test-token", jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals(1L, jwtResponse.getId());
        assertEquals("user@example.com", jwtResponse.getUsername());
        assertEquals("Jean", jwtResponse.getFirstName());
        assertEquals("Dupont", jwtResponse.getLastName());
        assertTrue(jwtResponse.getAdmin());
    }

    @Test
    public void testSetters() {
        JwtResponse jwtResponse = new JwtResponse("", 0L, "", "", "", false);

        jwtResponse.setToken("new-token");
        jwtResponse.setType("CustomType");
        jwtResponse.setId(42L);
        jwtResponse.setUsername("newuser@example.com");
        jwtResponse.setFirstName("Alice");
        jwtResponse.setLastName("Liddell");
        jwtResponse.setAdmin(true);

        assertEquals("new-token", jwtResponse.getToken());
        assertEquals("CustomType", jwtResponse.getType());
        assertEquals(42L, jwtResponse.getId());
        assertEquals("newuser@example.com", jwtResponse.getUsername());
        assertEquals("Alice", jwtResponse.getFirstName());
        assertEquals("Liddell", jwtResponse.getLastName());
        assertTrue(jwtResponse.getAdmin());
    }

    @Test
    public void testToString() {
        JwtResponse jwtResponse = new JwtResponse("abc123", 1L, "user@example.com", "Jean", "Dupont", false);
        String expected = "JwtResponse{token='abc123', type='Bearer', id=1, username='user@example.com', firstName='Jean', lastName='Dupont', admin=false}";
        assertEquals(expected, jwtResponse.toString());
    }
}
