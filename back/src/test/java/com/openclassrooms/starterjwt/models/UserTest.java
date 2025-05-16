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
        User user = new User(1L, "email@example.com", "Doe", "John", "password123", true, now, now);

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

    @Test
    void testEquals_SameId() {
        User user1 = new User();
        User user2 = new User();
        user1.setId(1L);
        user2.setId(1L);
        assertThat(user1).isEqualTo(user2);
    }

    @Test
    void testEquals_DifferentId() {
        User user1 = new User();
        User user2 = new User();
        user1.setId(1L);
        user2.setId(2L);
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    void testEquals_NullAndDifferentClass() {
        User user = new User();
        user.setId(1L);

        assertThat(user.equals(null)).isFalse();
        assertThat(user.equals("a string")).isFalse();//user n’est pas égal à un objet d’un autre type que String
    }

    @Test
    void testEquals_BothNullIds() {
        User user1 = new User();
        User user2 = new User();
        assertThat(user1).isEqualTo(user2);
    }

    @Test
    void testHashCode_WithId() {
        User user1 = new User();
        User user2 = new User();
        user1.setId(10L);
        user2.setId(10L);

        assertThat(user1.hashCode()).isEqualTo(user2.hashCode());
    }

    @Test
    void testHashCode_NullId() {
        User user1 = new User();
        User user2 = new User();
        user1.setId(null);
        user2.setId(null);

        assertThat(user1.hashCode()).isEqualTo(user2.hashCode());
    }

    @Test
    void testToStringContainsFields() {
        LocalDateTime now = LocalDateTime.now();
        User user = new User(1L, "john@example.com", "Doe", "John", "pass", true, now, now);
        String str = user.toString();

        assertThat(str).contains("id=1", "email=john@example.com", "firstName=John", "lastName=Doe");
    }

    @Test
    void testConstructorWithoutIdAndDates() {
        User user = new User("john@example.com", "Doe", "John", "pass123", false);

        assertThat(user.getEmail()).isEqualTo("john@example.com");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getPassword()).isEqualTo("pass123");
        assertThat(user.isAdmin()).isFalse();
    }

    @Test
    void testEquals_SameReference() {
      User user = new User();
      assertThat(user.equals(user)).isTrue(); // couvre `if (this == o)` cad si on compare un objet avec lui-même il retourne true
    }

}
