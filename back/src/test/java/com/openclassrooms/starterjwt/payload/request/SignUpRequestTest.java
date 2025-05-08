package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SignupRequestTest {

    private SignupRequest createSignupRequest(String email, String firstName, String lastName, String password) {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(email);
        signupRequest.setFirstName(firstName);
        signupRequest.setLastName(lastName);
        signupRequest.setPassword(password);
        return signupRequest;
    }

    @Test
    public void testConstructorWithAllFields() {
        SignupRequest signupRequest = new SignupRequest("test@example.com", "John", "Doe", "password123");

        assertEquals("test@example.com", signupRequest.getEmail());
        assertEquals("John", signupRequest.getFirstName());
        assertEquals("Doe", signupRequest.getLastName());
        assertEquals("password123", signupRequest.getPassword());
    }

    @Test
    public void testSignupRequestWithValidFields() {
        SignupRequest signupRequest = createSignupRequest("test@example.com", "John", "Doe", "password123");

        assertEquals("test@example.com", signupRequest.getEmail());
        assertEquals("John", signupRequest.getFirstName());
        assertEquals("Doe", signupRequest.getLastName());
        assertEquals("password123", signupRequest.getPassword());
    }

    @Test
    public void testSignupRequestWithInvalidEmail() {
        SignupRequest signupRequest = createSignupRequest("invalid-email", "John", "Doe", "password123");

        assertEquals("invalid-email", signupRequest.getEmail());
        assertEquals("John", signupRequest.getFirstName());
        assertEquals("Doe", signupRequest.getLastName());
        assertEquals("password123", signupRequest.getPassword());
    }

    @Test
    public void testSignupRequestWithBlankFields() {
        SignupRequest signupRequest = createSignupRequest("", "", "", "");

        assertEquals("", signupRequest.getEmail());
        assertEquals("", signupRequest.getFirstName());
        assertEquals("", signupRequest.getLastName());
        assertEquals("", signupRequest.getPassword());
    }

    @Test
    public void testSignupRequestWithShortFirstName() {
        SignupRequest signupRequest = createSignupRequest("test@example.com", "Jo", "Doe", "password123");

        assertEquals("Jo", signupRequest.getFirstName());
        assertEquals("test@example.com", signupRequest.getEmail());
        assertEquals("Doe", signupRequest.getLastName());
        assertEquals("password123", signupRequest.getPassword());
    }

    @Test
    public void testSignupRequestWithLongPassword() {
        SignupRequest signupRequest = createSignupRequest("test@example.com", "John", "Doe", "thispasswordiswaytoolongandshouldfailvalidation");

        assertEquals("thispasswordiswaytoolongandshouldfailvalidation", signupRequest.getPassword());
        assertEquals("test@example.com", signupRequest.getEmail());
        assertEquals("John", signupRequest.getFirstName());
        assertEquals("Doe", signupRequest.getLastName());
    }

    @Test
    public void testSignupRequestGettersAndSetters() {
        SignupRequest signupRequest = createSignupRequest("user@example.com", "Jane", "Smith", "securepassword");

        assertEquals("user@example.com", signupRequest.getEmail());
        assertEquals("Jane", signupRequest.getFirstName());
        assertEquals("Smith", signupRequest.getLastName());
        assertEquals("securepassword", signupRequest.getPassword());
    }

    @Test
    public void testEqualsAndHashCode() {
        SignupRequest req1 = new SignupRequest("email@example.com", "John", "Doe", "password123");
        SignupRequest req2 = new SignupRequest("email@example.com", "John", "Doe", "password123");
        SignupRequest req3 = new SignupRequest("different@example.com", "Jane", "Smith", "diffpass");

        // Les deux objets identiques doivent être égaux
        assertEquals(req1, req2);
        assertEquals(req1.hashCode(), req2.hashCode());

        // Les objets différents ne doivent pas être égaux
        assertNotEquals(req1, req3);
        assertNotEquals(req1.hashCode(), req3.hashCode());
    }

    @Test
    public void testToString() {
        SignupRequest signupRequest = new SignupRequest("email@example.com", "John", "Doe", "password123");

        String toString = signupRequest.toString();

        assertNotNull(toString);
        assertTrue(toString.contains("email@example.com"));
        assertTrue(toString.contains("John"));
        assertTrue(toString.contains("Doe"));
    }

    @Test
    public void testCanEqual() {
        SignupRequest signupRequest = new SignupRequest();
        assertTrue(signupRequest.canEqual(new SignupRequest()));
        assertFalse(signupRequest.canEqual("NotASignupRequest")); // Cas négatif
      }

}
