package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class TeacherTest {

    @Test
    void testConstructorAndGetters() {
        LocalDateTime now = LocalDateTime.now();

        Teacher teacher = new Teacher(1L, "Doe", "John", now, now);

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getLastName()).isEqualTo("Doe");
        assertThat(teacher.getFirstName()).isEqualTo("John");
        assertThat(teacher.getCreatedAt()).isEqualTo(now);
        assertThat(teacher.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testSetters() {
        Teacher teacher = new Teacher();

        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = createdAt.plusHours(1);

        teacher.setId(10L);
        teacher.setLastName("Smith");
        teacher.setFirstName("Alice");
        teacher.setCreatedAt(createdAt);
        teacher.setUpdatedAt(updatedAt);

        assertThat(teacher.getId()).isEqualTo(10L);
        assertThat(teacher.getLastName()).isEqualTo("Smith");
        assertThat(teacher.getFirstName()).isEqualTo("Alice");
        assertThat(teacher.getCreatedAt()).isEqualTo(createdAt);
        assertThat(teacher.getUpdatedAt()).isEqualTo(updatedAt);
    }

    @Test
    void testToString() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = new Teacher(5L, "Dupont", "Marie", now, now);

        String expected = "Teacher{id=5, lastName='Dupont', firstName='Marie', createdAt=" + now + ", updatedAt=" + now + "}";
        assertThat(teacher.toString()).isEqualTo(expected);
    }
}
