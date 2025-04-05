package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class UserTest {

    @Test
    void testNoArgsConstructor() {
        User user = new User();
        assertThat(user).isNotNull();
    }

    @Test
    void testConstructorWithoutAuditFields() {
        User user = new User("email@example.com", "Doe", "John", "password123", true);

        assertThat(user.getEmail()).isEqualTo("email@example.com");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getPassword()).isEqualTo("password123");
        assertThat(user.isAdmin()).isTrue();
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();

        User user = new User(
                1L,
                "email@example.com",
                "Doe",
                "John",
                "password123",
                true,
                now,
                now
        );

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getEmail()).isEqualTo("email@example.com");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getPassword()).isEqualTo("password123");
        assertThat(user.isAdmin()).isTrue();
        assertThat(user.getCreatedAt()).isEqualTo(now);
        assertThat(user.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testSettersAndGetters() {
        User user = new User();
        LocalDateTime now = LocalDateTime.now();

        user.setId(42L);
        user.setEmail("test@openclassrooms.com");
        user.setLastName("Philibert");
        user.setFirstName("Cathy");
        user.setPassword("securePass!");
        user.setAdmin(false);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        assertThat(user.getId()).isEqualTo(42L);
        assertThat(user.getEmail()).isEqualTo("test@openclassrooms.com");
        assertThat(user.getLastName()).isEqualTo("Philibert");
        assertThat(user.getFirstName()).isEqualTo("Cathy");
        assertThat(user.getPassword()).isEqualTo("securePass!");
        assertThat(user.isAdmin()).isFalse();
        assertThat(user.getCreatedAt()).isEqualTo(now);
        assertThat(user.getUpdatedAt()).isEqualTo(now);
    }
}
