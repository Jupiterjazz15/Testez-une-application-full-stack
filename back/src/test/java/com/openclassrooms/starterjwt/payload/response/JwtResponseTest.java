package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtResponseTest {

    @Test
    public void testJwtResponseConstructorAndGetters() {
        String accessToken = "testToken";
        Long id = 1L;
        String username = "testUser";
        String firstName = "John";
        String lastName = "Doe";
        Boolean admin = true;

         // instancie JwtResponse avec ces valeurs
        JwtResponse jwtResponse = new JwtResponse(accessToken, id, username, firstName, lastName, admin);

        // vérifications que les getters retournent les bonnes valeurs
        assertEquals(accessToken, jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals(id, jwtResponse.getId());
        assertEquals(username, jwtResponse.getUsername());
        assertEquals(firstName, jwtResponse.getFirstName());
        assertEquals(lastName, jwtResponse.getLastName());
        assertEquals(admin, jwtResponse.isAdmin());
    }

    @Test
    public void testJwtResponseSetters() {
        JwtResponse jwtResponse = new JwtResponse(null, null, null, null, null, null);

        String accessToken = "newToken";
        Long id = 2L;
        String username = "newUser";
        String firstName = "Jane";
        String lastName = "Smith";
        Boolean admin = false;

        jwtResponse.setToken(accessToken);
        jwtResponse.setId(id);
        jwtResponse.setUsername(username);
        jwtResponse.setFirstName(firstName);
        jwtResponse.setLastName(lastName);
        jwtResponse.setAdmin(admin);

        assertEquals(accessToken, jwtResponse.getToken());
        assertEquals(id, jwtResponse.getId());
        assertEquals(username, jwtResponse.getUsername());
        assertEquals(firstName, jwtResponse.getFirstName());
        assertEquals(lastName, jwtResponse.getLastName());
        assertEquals(admin, jwtResponse.isAdmin());
    }

    @Test
    public void testDefaultTokenType() {
    // même avec aucune donnée au constructeur, le champ type de JwtResponse est bien initialisé par défaut à "Bearer".
        JwtResponse jwtResponse = new JwtResponse(null, null, null, null, null, null);

        assertEquals("Bearer", jwtResponse.getType(), "Default token type should be 'Bearer'");
    }

    @Test
    public void testTokenTypeCanBeChanged() {
        JwtResponse jwtResponse = new JwtResponse(null, null, null, null, null, null);

        jwtResponse.setType("NewType");
        assertEquals("NewType", jwtResponse.getType(), "Token type should be changeable.");
    }
}
