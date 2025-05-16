package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    private UserDetailsImpl userDetails;

    @BeforeEach
    public void setUp() {
        userDetails = new UserDetailsImpl(
                1L,
                "testUser",
                "John",
                "Doe",
                "password",
                true
        );
    }

    @Test
    public void testGetId() {
        assertEquals(1L, userDetails.getId());
    }

    @Test
    public void testGetUsername() {
        assertEquals("testUser", userDetails.getUsername());
    }

    @Test
    public void testGetFirstName() {
        assertEquals("John", userDetails.getFirstName());
    }

    @Test
    public void testGetLastName() {
        assertEquals("Doe", userDetails.getLastName());
    }

    @Test
    public void testIsAdmin() {
        assertTrue(userDetails.isAdmin());
    }


    @Test
    public void testGetPassword() {
        assertEquals("password", userDetails.getPassword());
    }

    @Test
    public void testGetAuthorities() {
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities instanceof HashSet);
    }

    @Test
    public void testIsAccountNonExpired() {
        assertTrue(userDetails.isAccountNonExpired());
    }

    @Test
    public void testIsAccountNonLocked() {
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired() {
        assertTrue(userDetails.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled() {
        assertTrue(userDetails.isEnabled());
    }

    @Test
    public void testEquals_SameObject() {
        assertTrue(userDetails.equals(userDetails));
    }

    @Test
    public void testEquals_DifferentObject() {
        assertFalse(userDetails.equals(new Object()));
    }

    @Test
    public void testEquals_NullObject() {
        assertFalse(userDetails.equals(null));
    }

    @Test
    public void testEquals_DifferentClass() {
        UserDetailsImpl otherUserDetails = new UserDetailsImpl(
                2L,
                "anotherUser",
                "Jane",
                "Smith",
                "anotherPassword",
                false
        );

        assertFalse(userDetails.equals(otherUserDetails));
    }

    @Test
    public void testEquals_SameId() {
        UserDetailsImpl sameIdUserDetails = new UserDetailsImpl(
                1L,
                "testUser",
                "John",
                "Doe",
                "password",
                true
        );

        assertTrue(userDetails.equals(sameIdUserDetails));
    }
}
