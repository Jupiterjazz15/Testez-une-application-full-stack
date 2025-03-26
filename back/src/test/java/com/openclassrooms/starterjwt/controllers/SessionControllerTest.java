//package com.openclassrooms.starterjwt.controllers;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.openclassrooms.starterjwt.dto.SessionDto;
//import com.openclassrooms.starterjwt.mapper.SessionMapper;
//import com.openclassrooms.starterjwt.models.Session;
//import com.openclassrooms.starterjwt.services.SessionService;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.Collections;
//import java.util.Date;
//import java.util.List;
//
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(SessionController.class)
//public class SessionControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private SessionService sessionService;
//
//    @MockBean
//    private SessionMapper sessionMapper;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    void testFindById_ReturnsSessionDto() throws Exception {
//        Session session = new Session();
//        session.setId(1L);
//        session.setName("Yoga");
//
//        SessionDto sessionDto = new SessionDto();
//        sessionDto.setId(1L);
//        sessionDto.setName("Yoga");
//
//        when(sessionService.getById(1L)).thenReturn(session);
//        when(sessionMapper.toDto(session)).thenReturn(sessionDto);
//
//        mockMvc.perform(get("/api/session/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L))
//                .andExpect(jsonPath("$.name").value("Yoga"));
//    }
//
//    @Test
//    void testFindById_NotFound() throws Exception {
//        when(sessionService.getById(1L)).thenReturn(null);
//
//        mockMvc.perform(get("/api/session/1"))
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    void testFindById_InvalidIdFormat() throws Exception {
//        mockMvc.perform(get("/api/session/abc"))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    void testFindAll() throws Exception {
//        Session session = new Session();
//        session.setId(1L);
//        session.setName("Pilates");
//
//        SessionDto sessionDto = new SessionDto();
//        sessionDto.setId(1L);
//        sessionDto.setName("Pilates");
//
//        when(sessionService.findAll()).thenReturn(List.of(session));
//        when(sessionMapper.toDto(List.of(session))).thenReturn(List.of(sessionDto));
//
//        mockMvc.perform(get("/api/session"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].id").value(1L));
//    }
//
//    @Test
//    void testCreateSession() throws Exception {
//        SessionDto dto = new SessionDto();
//        dto.setName("Meditation");
//
//        Session entity = new Session();
//        entity.setId(1L);
//        entity.setName("Meditation");
//
//        Session saved = new Session();
//        saved.setId(1L);
//        saved.setName("Meditation");
//
//        SessionDto responseDto = new SessionDto();
//        responseDto.setId(1L);
//        responseDto.setName("Meditation");
//
//        when(sessionMapper.toEntity(dto)).thenReturn(entity);
//        when(sessionService.create(entity)).thenReturn(saved);
//        when(sessionMapper.toDto(saved)).thenReturn(responseDto);
//
//        mockMvc.perform(post("/api/session")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1L));
//    }
//
//    @Test
//    void testUpdateSession_ValidId() throws Exception {
//        SessionDto dto = new SessionDto();
//        dto.setName("New Session");
//
//        Session updated = new Session();
//        updated.setId(1L);
//        updated.setName("New Session");
//
//        SessionDto responseDto = new SessionDto();
//        responseDto.setId(1L);
//        responseDto.setName("New Session");
//
//        when(sessionMapper.toEntity(dto)).thenReturn(updated);
//        when(sessionService.update(1L, updated)).thenReturn(updated);
//        when(sessionMapper.toDto(updated)).thenReturn(responseDto);
//
//        mockMvc.perform(put("/api/session/1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.name").value("New Session"));
//    }
//
//    @Test
//    void testUpdateSession_InvalidId() throws Exception {
//        SessionDto dto = new SessionDto();
//        dto.setName("Whatever");
//
//        mockMvc.perform(put("/api/session/abc")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    void testDeleteSession_Valid() throws Exception {
//        Session session = new Session();
//        session.setId(1L);
//
//        when(sessionService.getById(1L)).thenReturn(session);
//
//        mockMvc.perform(delete("/api/session/1"))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    void testDeleteSession_NotFound() throws Exception {
//        when(sessionService.getById(1L)).thenReturn(null);
//
//        mockMvc.perform(delete("/api/session/1"))
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    void testParticipate_ValidIds() throws Exception {
//        mockMvc.perform(post("/api/session/1/participate/2"))
//                .andExpect(status().isOk());
//
//        verify(sessionService).participate(1L, 2L);
//    }
//
//    @Test
//    void testParticipate_InvalidId() throws Exception {
//        mockMvc.perform(post("/api/session/abc/participate/xyz"))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    void testNoLongerParticipate_ValidIds() throws Exception {
//        mockMvc.perform(delete("/api/session/1/participate/2"))
//                .andExpect(status().isOk());
//
//        verify(sessionService).noLongerParticipate(1L, 2L);
//    }
//
//    @Test
//    void testNoLongerParticipate_InvalidId() throws Exception {
//        mockMvc.perform(delete("/api/session/abc/participate/xyz"))
//                .andExpect(status().isBadRequest());
//    }
//}
