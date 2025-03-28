package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

public class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    private Session session1;
    private Session session2;
    private SessionDto sessionDto1;
    private SessionDto sessionDto2;

    @BeforeEach
    public void setup() throws Exception {
        MockitoAnnotations.openMocks(this);

        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = new Teacher(1L, "Jean", "Dupont", now, now);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date1 = sdf.parse("2025-05-20");
        Date date2 = sdf.parse("2025-05-21");

        session1 = new Session(1L, "Yoga Matin", date1, "Séance douce du matin", teacher, Collections.emptyList(), now, now);
        session2 = new Session(2L, "Yoga Soir", date2, "Séance relax du soir", teacher, Collections.emptyList(), now, now);

        sessionDto1 = new SessionDto(1L, "Yoga Matin", date1, 1L, "Séance douce du matin", Collections.emptyList(), now, now);
        sessionDto2 = new SessionDto(2L, "Yoga Soir", date2, 1L, "Séance relax du soir", Collections.emptyList(), now, now);
    }

    @Test
    void testFindAll_ReturnsListOfSessions() {
        when(sessionService.findAll()).thenReturn(Arrays.asList(session1, session2));

        SessionDto dto1 = new SessionDto(session1.getId(), session1.getName(), session1.getDate(),
                session1.getTeacher().getId(), session1.getDescription(), null, session1.getCreatedAt(), session1.getUpdatedAt());

        SessionDto dto2 = new SessionDto(session2.getId(), session2.getName(), session2.getDate(),
                session2.getTeacher().getId(), session2.getDescription(), null, session2.getCreatedAt(), session2.getUpdatedAt());

        when(sessionMapper.toDto(anyList())).thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(200, response.getStatusCodeValue());

        List<SessionDto> body = (List<SessionDto>) response.getBody();
        assertNotNull(body);
        assertEquals(2, body.size());
        assertEquals("Yoga Matin", body.get(0).getName());
        assertEquals("Yoga Soir", body.get(1).getName());
    }

    @Test
    void testFindById_ReturnsSession() {
        when(sessionService.getById(1L)).thenReturn(session1);
        when(sessionMapper.toDto(session1)).thenReturn(sessionDto1);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        SessionDto dto = (SessionDto) response.getBody();
        assertNotNull(dto);
        assertEquals("Yoga Matin", dto.getName());
    }

    @Test
    void testFindById_NotFound() {
        when(sessionService.getById(999L)).thenReturn(null);

        ResponseEntity<?> response = sessionController.findById("999");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testFindById_InvalidId() {
        ResponseEntity<?> response = sessionController.findById("invalid");

        assertEquals(400, response.getStatusCodeValue());
    }
}
