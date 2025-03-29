package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    @Test
    public void testUserDetailsProperties() {
        UserDetailsImpl user = new UserDetailsImpl(
                1L,
                "jane.doe@example.com",
                "Jane",
                "Doe",
                true,
                "securePassword"
        );

        assertEquals(1L, user.getId());
        assertEquals("jane.doe@example.com", user.getUsername());
        assertEquals("Jane", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertTrue(user.isAdmin());
        assertEquals("securePassword", user.getPassword());
    }

    @Test
    public void testUserDetailsDefaultMethods() {
        UserDetailsImpl user = new UserDetailsImpl();

        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
    }

    @Test
    public void testUserAuthoritiesIsEmptyByDefault() {
        UserDetailsImpl user = new UserDetailsImpl();
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities instanceof HashSet);
        assertTrue(authorities.isEmpty());
    }

    @Test
    public void testEquals() {
        UserDetailsImpl user1 = new UserDetailsImpl(1L, "user1", "John", "Smith", false, "pass");
        UserDetailsImpl user2 = new UserDetailsImpl(1L, "user2", "Jane", "Doe", true, "pass");

        assertEquals(user1, user2); // même id
    }

    @Test
    public void testNotEquals() {
        UserDetailsImpl user1 = new UserDetailsImpl(1L, "user1", "John", "Smith", false, "pass");
        UserDetailsImpl user2 = new UserDetailsImpl(2L, "user2", "Jane", "Doe", true, "pass");

        assertNotEquals(user1, user2);
    }
}
