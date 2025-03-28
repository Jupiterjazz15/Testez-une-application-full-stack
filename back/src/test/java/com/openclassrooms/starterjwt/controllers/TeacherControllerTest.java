package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherControllerTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    private Teacher teacher1;
    private Teacher teacher2;
    private TeacherDto dto1;
    private TeacherDto dto2;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();

        teacher1 = new Teacher(1L, "Jean", "Dupont", now, now);
        teacher2 = new Teacher(2L, "Marie", "Curie", now, now);
        dto1 = new TeacherDto(1L, "Dupont", "Jean", now, now);
        dto2 = new TeacherDto(2L, "Curie", "Marie", now, now);
    }

    @Test
    void testFindAll_ReturnsListOfTeachers() {
        when(teacherService.findAll()).thenReturn(Arrays.asList(teacher1, teacher2));

        when(teacherMapper.toDto(anyList())).thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<?> response = teacherController.findAll();

        assertEquals(200, response.getStatusCodeValue());

        List<TeacherDto> body = (List<TeacherDto>) response.getBody();
        assertNotNull(body);
        assertEquals(2, body.size());
        assertEquals("Jean", body.get(0).getFirstName());
        assertEquals("Marie", body.get(1).getFirstName());
    }

    @Test
    void testFindById_ReturnsTeacher() {
        when(teacherService.findById(1L)).thenReturn(teacher1);
        when(teacherMapper.toDto(teacher1)).thenReturn(dto1);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        TeacherDto body = (TeacherDto) response.getBody();
        assertNotNull(body);
        assertEquals("Jean", body.getFirstName());
    }

    @Test
    void testFindById_NotFound() {
        when(teacherService.findById(999L)).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("999");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testFindById_InvalidIdFormat() {
        ResponseEntity<?> response = teacherController.findById("invalid");

        assertEquals(400, response.getStatusCodeValue());
    }
}
