package com.openclassrooms.starterjwt.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TeacherDtoTest {

    @Test
    void testConstructorAndGetters() {
        LocalDateTime now = LocalDateTime.now();
        TeacherDto teacherDto = new TeacherDto(1L, "Doe", "John", now, now);

        assertEquals(1L, teacherDto.getId());
        assertEquals("Doe", teacherDto.getLastName());
        assertEquals("John", teacherDto.getFirstName());
        assertEquals(now, teacherDto.getCreatedAt());
        assertEquals(now, teacherDto.getUpdatedAt());
    }

    @Test
    void testSetters() {
        TeacherDto teacherDto = new TeacherDto();
        LocalDateTime now = LocalDateTime.now();

        teacherDto.setId(2L);
        teacherDto.setLastName("Smith");
        teacherDto.setFirstName("Alice");
        teacherDto.setCreatedAt(now);
        teacherDto.setUpdatedAt(now);

        assertEquals(2L, teacherDto.getId());
        assertEquals("Smith", teacherDto.getLastName());
        assertEquals("Alice", teacherDto.getFirstName());
        assertEquals(now, teacherDto.getCreatedAt());
        assertEquals(now, teacherDto.getUpdatedAt());
    }

    @Test
    void testToString() {
        LocalDateTime now = LocalDateTime.now();
        TeacherDto teacherDto = new TeacherDto(3L, "Brown", "Charlie", now, now);
        String expected = "TeacherDto{id=3, lastName='Brown', firstName='Charlie', createdAt=" + now + ", updatedAt=" + now + "}";

        assertEquals(expected, teacherDto.toString());
    }
}

