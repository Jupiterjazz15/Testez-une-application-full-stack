package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class TeacherServiceTest {

    private TeacherRepository teacherRepository;
    private TeacherService teacherService;

    @BeforeEach
    public void setUp() {
        teacherRepository = mock(TeacherRepository.class);
        teacherService = new TeacherService(teacherRepository);
    }

    // Ce test vérifie que la méthode findAll retourne la liste des enseignants fournie par le repository
    @Test
    public void testFindAllReturnsAllTeachers() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("Marie");
        teacher1.setLastName("Curie");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Albert");
        teacher2.setLastName("Einstein");

        List<Teacher> expectedTeachers = Arrays.asList(teacher1, teacher2);
        when(teacherRepository.findAll()).thenReturn(expectedTeachers);

        List<Teacher> result = teacherService.findAll();

        assertThat(result).isEqualTo(expectedTeachers);
        verify(teacherRepository, times(1)).findAll();
    }

    // Ce test vérifie que la méthode findById retourne un enseignant existant
    @Test
    public void testFindByIdReturnsTeacher() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Ada");
        teacher.setLastName("Lovelace");

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findById(1L);

        assertThat(result).isEqualTo(teacher);
        verify(teacherRepository, times(1)).findById(1L);
    }

    // Ce test vérifie que la méthode findById retourne null si l'enseignant n'existe pas
    @Test
    public void testFindByIdReturnsNullIfNotFound() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(1L);

        assertThat(result).isNull();
        verify(teacherRepository, times(1)).findById(1L);
    }
}
