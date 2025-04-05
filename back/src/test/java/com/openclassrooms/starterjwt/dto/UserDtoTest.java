package com.openclassrooms.starterjwt.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class UserDtoTest {

    @Test
    void testUserDtoConstructorAndGetters() {
        LocalDateTime now = LocalDateTime.now();
        UserDto userDto = new UserDto(1L, "test@example.com", "Doe", "John", true, "password123", now, now);

        assertThat(userDto.getId()).isEqualTo(1L);
        assertThat(userDto.getEmail()).isEqualTo("test@example.com");
        assertThat(userDto.getLastName()).isEqualTo("Doe");
        assertThat(userDto.getFirstName()).isEqualTo("John");
        assertThat(userDto.isAdmin()).isTrue();
        assertThat(userDto.getCreatedAt()).isEqualTo(now);
        assertThat(userDto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testUserDtoSetters() {
        UserDto userDto = new UserDto();
        LocalDateTime now = LocalDateTime.now();

        userDto.setId(2L);
        userDto.setEmail("new@example.com");
        userDto.setLastName("Smith");
        userDto.setFirstName("Jane");
        userDto.setAdmin(false);
        userDto.setCreatedAt(now);
        userDto.setUpdatedAt(now);

        assertThat(userDto.getId()).isEqualTo(2L);
        assertThat(userDto.getEmail()).isEqualTo("new@example.com");
        assertThat(userDto.getLastName()).isEqualTo("Smith");
        assertThat(userDto.getFirstName()).isEqualTo("Jane");
        assertThat(userDto.isAdmin()).isFalse();
        assertThat(userDto.getCreatedAt()).isEqualTo(now);
        assertThat(userDto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testToString() {
        LocalDateTime now = LocalDateTime.now();
        UserDto userDto = new UserDto(3L, "sample@example.com", "Brown", "Charlie", false, "securepass", now, now);

        String expectedString = "UserDto{id=3, email='sample@example.com', lastName='Brown', firstName='Charlie', admin=false, createdAt=" + now + ", updatedAt=" + now + "}";
        assertThat(userDto.toString()).isEqualTo(expectedString);
    }
}
