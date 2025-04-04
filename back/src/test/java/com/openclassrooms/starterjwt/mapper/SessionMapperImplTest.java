package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Date;
import java.util.List;

class SessionMapperImplTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private SessionMapperImpl sessionMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void toEntity_shouldConvertDtoToEntity() {
        // Given
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Yoga Class");
        dto.setDescription("Morning yoga session");
        dto.setDate(new Date());
        dto.setTeacher_id(2L);
        dto.setUsers(List.of(3L, 4L));

        Teacher mockTeacher = new Teacher();
        mockTeacher.setId(2L);
        when(teacherService.findById(2L)).thenReturn(mockTeacher);

        User mockUser1 = new User();
        mockUser1.setId(3L);
        User mockUser2 = new User();
        mockUser2.setId(4L);
        when(userService.findById(3L)).thenReturn(mockUser1);
        when(userService.findById(4L)).thenReturn(mockUser2);

        // When
        Session entity = sessionMapper.toEntity(dto);

        // Then
        assertNotNull(entity);
        assertEquals(dto.getId(), entity.getId());
        assertEquals(dto.getName(), entity.getName());
        assertEquals(dto.getDescription(), entity.getDescription());
        assertEquals(dto.getTeacher_id(), entity.getTeacher().getId());
        assertEquals(dto.getUsers().size(), entity.getUsers().size());
    }

    @Test
    void toDto_shouldConvertEntityToDto() {
        // Given
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga Class");
        session.setDescription("Morning yoga session");
        session.setDate(new Date());

        Teacher teacher = new Teacher();
        teacher.setId(2L);
        session.setTeacher(teacher);

        User user1 = new User();
        user1.setId(3L);
        User user2 = new User();
        user2.setId(4L);
        session.setUsers(List.of(user1, user2));

        // When
        SessionDto dto = sessionMapper.toDto(session);

        // Then
        assertNotNull(dto);
        assertEquals(session.getId(), dto.getId());
        assertEquals(session.getName(), dto.getName());
        assertEquals(session.getDescription(), dto.getDescription());
        assertEquals(session.getTeacher().getId(), dto.getTeacher_id());
        assertEquals(session.getUsers().size(), dto.getUsers().size());
    }

    @Test
    void toEntity_shouldHandleNullDto() {
        assertNull(sessionMapper.toEntity((SessionDto) null));
    }

    @Test
    void toDto_shouldHandleNullEntity() {
        assertNull(sessionMapper.toDto((Session) null));
    }

    @Test
    void toEntityList_shouldConvertDtoListToEntityList() {
        List<SessionDto> dtoList = List.of(new SessionDto(), new SessionDto());

        List<Session> entityList = sessionMapper.toEntity(dtoList);

        assertNotNull(entityList);
        assertEquals(dtoList.size(), entityList.size());
    }

    @Test
    void toDtoList_shouldConvertEntityListToDtoList() {
        List<Session> entityList = List.of(new Session(), new Session());

        List<SessionDto> dtoList = sessionMapper.toDto(entityList);

        assertNotNull(dtoList);
        assertEquals(entityList.size(), dtoList.size());
    }

}
