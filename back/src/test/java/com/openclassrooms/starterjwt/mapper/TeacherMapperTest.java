package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherMapperTest {

    private TeacherMapper teacherMapper;

    @BeforeEach
    public void setUp() {
        teacherMapper = Mappers.getMapper(TeacherMapper.class);
    }

    // Teste la conversion d'un TeacherDto en entité Teacher
    @Test
    public void testToEntity() {
        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setFirstName("Jane");
        dto.setLastName("Smith");
        dto.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        dto.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));

        Teacher teacher = teacherMapper.toEntity(dto);

        assertEquals(dto.getId(), teacher.getId());
        assertEquals(dto.getFirstName(), teacher.getFirstName());
        assertEquals(dto.getLastName(), teacher.getLastName());
        assertEquals(dto.getCreatedAt(), teacher.getCreatedAt());
        assertEquals(dto.getUpdatedAt(), teacher.getUpdatedAt());
    }

    // Teste la conversion d'un Teacher en TeacherDto
    @Test
    public void testToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(2L);
        teacher.setFirstName("Paul");
        teacher.setLastName("Anderson");
        teacher.setCreatedAt(LocalDateTime.parse("2024-09-01T10:00:00"));
        teacher.setUpdatedAt(LocalDateTime.parse("2024-09-01T10:00:00"));

        TeacherDto dto = teacherMapper.toDto(teacher);

        assertEquals(teacher.getId(), dto.getId());
        assertEquals(teacher.getFirstName(), dto.getFirstName());
        assertEquals(teacher.getLastName(), dto.getLastName());
        assertEquals(teacher.getCreatedAt(), dto.getCreatedAt());
        assertEquals(teacher.getUpdatedAt(), dto.getUpdatedAt());
    }

    // Teste la conversion d'une liste de TeacherDto en liste d'entités Teacher
    @Test
    public void testToEntityList() {
        TeacherDto dto1 = new TeacherDto();
        dto1.setId(1L);
        dto1.setFirstName("Alice");
        dto1.setLastName("Martin");

        TeacherDto dto2 = new TeacherDto();
        dto2.setId(2L);
        dto2.setFirstName("Bob");
        dto2.setLastName("Taylor");

        List<TeacherDto> dtoList = Arrays.asList(dto1, dto2);

        List<Teacher> teacherList = teacherMapper.toEntity(dtoList);

        assertEquals(dtoList.size(), teacherList.size());
        assertEquals(dtoList.get(0).getFirstName(), teacherList.get(0).getFirstName());
        assertEquals(dtoList.get(1).getLastName(), teacherList.get(1).getLastName());
    }

    // Teste la conversion d'une liste de Teacher en liste de TeacherDto
    @Test
    public void testToDtoList() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("Emma");
        teacher1.setLastName("Wilson");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Liam");
        teacher2.setLastName("Brown");

        List<Teacher> teacherList = Arrays.asList(teacher1, teacher2);

        List<TeacherDto> dtoList = teacherMapper.toDto(teacherList);

        assertEquals(teacherList.size(), dtoList.size());
        assertEquals(teacherList.get(0).getId(), dtoList.get(0).getId());
        assertEquals(teacherList.get(1).getFirstName(), dtoList.get(1).getFirstName());
    }
}
