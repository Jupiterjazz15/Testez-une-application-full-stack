//package com.openclassrooms.starterjwt.controllers;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.openclassrooms.starterjwt.dto.TeacherDto;
//import com.openclassrooms.starterjwt.models.Teacher;
//import com.openclassrooms.starterjwt.services.TeacherService;
//import com.openclassrooms.starterjwt.mapper.TeacherMapper;
//import com.openclassrooms.starterjwt.TestSecurityConfig;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.time.LocalDateTime;
//import java.util.Arrays;
//
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(TeacherController.class)
//@Import(TestSecurityConfig.class)
//public class TeacherControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private TeacherService teacherService;
//
//    @MockBean
//    private TeacherMapper teacherMapper;
//
//    @Test
//    public void testFindAll_ReturnsListOfTeachers() throws Exception {
//        LocalDateTime now = LocalDateTime.now();
//
//        Teacher teacher1 = new Teacher(1L, "Jean", "Dupont", now, now);
//        Teacher teacher2 = new Teacher(2L, "Marie", "Curie", now, now);
//
//        TeacherDto dto1 = new TeacherDto(1L, "Dupont", "Jean", now, now);
//        TeacherDto dto2 = new TeacherDto(2L, "Curie", "Marie", now, now);
//
//        when(teacherService.findAll()).thenReturn(Arrays.asList(teacher1, teacher2));
//        when(teacherMapper.toDto(teacher1)).thenReturn(dto1);
//        when(teacherMapper.toDto(teacher2)).thenReturn(dto2);
//
//        mockMvc.perform(get("/api/teacher"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(2))
//                .andExpect(jsonPath("$[0].firstName").value("Jean"))
//                .andExpect(jsonPath("$[1].firstName").value("Marie"));
//    }
//
//    @Test
//    public void testFindById_ReturnsTeacher() throws Exception {
//        LocalDateTime now = LocalDateTime.now();
//        Teacher teacher = new Teacher(1L, "Jean", "Dupont", now, now);
//        TeacherDto dto = new TeacherDto(1L, "Dupont", "Jean", now, now);
//
//        when(teacherService.findById(1L)).thenReturn(teacher);
//        when(teacherMapper.toDto(teacher)).thenReturn(dto);
//
//        mockMvc.perform(get("/api/teacher/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.firstName").value("Jean"))
//                .andExpect(jsonPath("$.lastName").value("Dupont"));
//    }
//
//    @Test
//    public void testFindById_NotFound() throws Exception {
//        when(teacherService.findById(999L)).thenReturn(null);
//
//        mockMvc.perform(get("/api/teacher/999"))
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    public void testFindById_InvalidIdFormat() throws Exception {
//        mockMvc.perform(get("/api/teacher/invalid"))
//                .andExpect(status().isBadRequest());
//    }
//}
