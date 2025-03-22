package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SessionMapperTest {

    private SessionMapper sessionMapper;
    private TeacherService teacherService;
    private UserService userService;

    @BeforeEach
    public void setUp() {
        teacherService = mock(TeacherService.class);
        userService = mock(UserService.class);

        sessionMapper = new SessionMapperImpl();
        sessionMapper.teacherService = teacherService;
        sessionMapper.userService = userService;
    }

    // Teste la conversion d'un SessionDto vers une entité Session
    @Test
    public void testToEntity() {
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Yoga Class");
        dto.setDate(new Date());
        dto.setDescription("Morning yoga session");
        dto.setTeacher_id(100L);
        dto.setUsers(Arrays.asList(1L, 2L));

        Teacher teacher = new Teacher();
        teacher.setId(100L);
        when(teacherService.findById(100L)).thenReturn(teacher);

        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);
        when(userService.findById(1L)).thenReturn(user1);
        when(userService.findById(2L)).thenReturn(user2);

        Session session = sessionMapper.toEntity(dto);

        assertEquals(dto.getName(), session.getName());
        assertEquals(dto.getDescription(), session.getDescription());
        assertEquals(dto.getDate(), session.getDate());
        assertEquals(teacher, session.getTeacher());
        assertEquals(2, session.getUsers().size());
    }

    // Teste la conversion d'une entité Session vers un SessionDto
    @Test
    public void testToDto() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga Class");
        session.setDate(new Date());
        session.setDescription("Morning yoga session");

        Teacher teacher = new Teacher();
        teacher.setId(100L);
        session.setTeacher(teacher);

        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);
        session.setUsers(Arrays.asList(user1, user2));

        SessionDto dto = sessionMapper.toDto(session);

        assertEquals(session.getName(), dto.getName());
        assertEquals(session.getDescription(), dto.getDescription());
        assertEquals(session.getDate(), dto.getDate());
        assertEquals(100L, dto.getTeacher_id());
        assertEquals(Arrays.asList(1L, 2L), dto.getUsers());
    }

    // Teste le comportement avec une liste d'utilisateurs nulle
    @Test
    public void testToEntityWithNullUsers() {
        SessionDto dto = new SessionDto();
        dto.setUsers(null);
        dto.setTeacher_id(null);

        Session session = sessionMapper.toEntity(dto);

        assertNotNull(session.getUsers());
        assertTrue(session.getUsers().isEmpty());
        assertNull(session.getTeacher());
    }

    // Teste le comportement avec une liste d'utilisateurs vide
    @Test
    public void testToDtoWithEmptyUsers() {
        Session session = new Session();
        session.setUsers(Collections.emptyList());
        session.setTeacher(null);

        SessionDto dto = sessionMapper.toDto(session);

        assertNotNull(dto.getUsers());
        assertTrue(dto.getUsers().isEmpty());
        assertNull(dto.getTeacher_id());
    }
}
