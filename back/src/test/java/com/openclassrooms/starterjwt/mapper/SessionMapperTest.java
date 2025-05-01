package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;  // Importation du DTO SessionDto
import com.openclassrooms.starterjwt.models.Session;  // Importation du modèle Session
import com.openclassrooms.starterjwt.models.Teacher;  // Importation du modèle Teacher
import com.openclassrooms.starterjwt.models.User;  // Importation du modèle User
import com.openclassrooms.starterjwt.services.TeacherService;  // Importation du service TeacherService
import com.openclassrooms.starterjwt.services.UserService;  // Importation du service UserService

import org.junit.jupiter.api.BeforeEach;  // Importation de la méthode BeforeEach pour exécuter avant chaque test
import org.junit.jupiter.api.Test;  // Importation de la méthode Test pour marquer une méthode de test
import static org.junit.jupiter.api.Assertions.assertEquals;  // Importation de la méthode assertEquals pour effectuer des assertions

import org.mockito.InjectMocks;  // Importation de InjectMocks pour injecter les mocks dans l'objet à tester
import org.mockito.Mock;  // Importation de Mock pour créer des objets simulés
import org.mockito.MockitoAnnotations;  // Importation de MockitoAnnotations pour initialiser les mocks
import static org.mockito.Mockito.when;  // Importation de when pour simuler le comportement des mocks

import org.springframework.boot.test.context.SpringBootTest;  // Importation de SpringBootTest pour configurer le contexte de test

import java.text.ParseException;  // Importation de ParseException pour gérer les erreurs de parsing
import java.text.SimpleDateFormat;  // Importation de SimpleDateFormat pour la gestion des dates
import java.time.LocalDateTime;  // Importation de LocalDateTime pour travailler avec les dates et heures
import java.util.Arrays;  // Importation de Arrays pour travaille r avec des tableaux
import java.util.Collections;  // Importation de Collections pour travailler avec des collections immuables
import java.util.List;  // Importation de List pour travailler avec des listes



@SpringBootTest  // Indique que le test doit s'exécuter dans un environnement Spring Boot
public class SessionMapperTest {

    @Mock  // Création d'un mock pour TeacherService
    private TeacherService teacherService;

    @Mock  // Création d'un mock pour UserService
    private UserService userService;

    @InjectMocks  // Injecte les mocks créés dans le SessionMapperImpl (la classe testée)
    private SessionMapperImpl sessionMapper;

    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");  // Création d'un objet SimpleDateFormat pour formater les dates

    @BeforeEach  // Méthode exécutée avant chaque test (avec la méthode setup de Junit)
    public void setUp() {
        MockitoAnnotations.openMocks(this);  // Initialise les mocks créés avec MockitoAnnotations
    }

    @Test  // Annotation Juint qui indique qu'il s'agit d'un test unitaire
    public void testToEntity() throws ParseException {
        // Création d'un objet SessionDto avec des données fictives
        SessionDto dto = new SessionDto();
        dto.setId(1L);
        dto.setName("Session 1");
        dto.setDescription("Description 1");
        dto.setDate(dateFormat.parse("2024-08-20T21:33:08"));  // Formatte la date en chaîne puis la parse
        dto.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));  // Initialisation de la date de création
        dto.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));  // Initialisation de la date de mise à jour
        dto.setTeacher_id(2L);  // ID de l'enseignant
        dto.setUsers(Arrays.asList(3L, 4L));  // Liste des ID des utilisateurs

        // Création d'un objet Teacher et d'un mock pour le service teacherService
        Teacher teacher = new Teacher();
        teacher.setId(2L);
        when(teacherService.findById(2L)).thenReturn(teacher);  // Simule le retour d'un enseignant avec l'ID 2

        // Création de deux objets User et des mocks pour userService
        User user1 = new User();
        user1.setId(3L);
        User user2 = new User();
        user2.setId(4L);
        when(userService.findById(3L)).thenReturn(user1);  // Simule le retour d'un utilisateur avec l'ID 3
        when(userService.findById(4L)).thenReturn(user2);  // Simule le retour d'un utilisateur avec l'ID 4

        // Conversion du DTO en entité Session
        Session session = sessionMapper.toEntity(dto);

        // Assertions pour vérifier que la conversion s'est faite correctement avec la méthode assertEquals de JUNIT
        assertEquals(dto.getId(), session.getId());
        assertEquals(dto.getName(), session.getName());
        assertEquals(dto.getDescription(), session.getDescription());
        assertEquals(dto.getDate(), session.getDate());
        assertEquals(dto.getCreatedAt(), session.getCreatedAt());
        assertEquals(dto.getUpdatedAt(), session.getUpdatedAt());
        assertEquals(dto.getTeacher_id(), session.getTeacher().getId());  // Vérifie que l'ID de l'enseignant est correct
        assertEquals(2, session.getUsers().size());  // Vérifie qu'il y a bien deux utilisateurs
        assertEquals(3L, session.getUsers().get(0).getId());  // Vérifie que l'ID du premier utilisateur est correct
        assertEquals(4L, session.getUsers().get(1).getId());  // Vérifie que l'ID du second utilisateur est correct
    }

    @Test // Test pour vérifier la conversion de Session en SessionDto
    // Création d'un objet Teacher
    public void testToDto() throws ParseException {
        Teacher teacher = new Teacher();
        teacher.setId(2L);

        // Création d'objets User
        User user1 = new User();
        user1.setId(3L);
        User user2 = new User();
        user2.setId(4L);

        // Création d'un objet Session avec des données fictives
        Session session = new Session();
        session.setId(1L);
        session.setName("Session 1");
        session.setDescription("Description 1");
        session.setDate(dateFormat.parse("2024-08-20T21:33:08"));
        session.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        session.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        session.setTeacher(teacher);
        session.setUsers(Arrays.asList(user1, user2));

        // Conversion de l'entité Session en DTO
        SessionDto dto = sessionMapper.toDto(session);

        // Assertions pour vérifier que la conversion s'est faite correctement
        assertEquals(session.getId(), dto.getId());
        assertEquals(session.getName(), dto.getName());
        assertEquals(session.getDescription(), dto.getDescription());
        assertEquals(session.getDate(), dto.getDate());
        assertEquals(session.getCreatedAt(), dto.getCreatedAt());
        assertEquals(session.getUpdatedAt(), dto.getUpdatedAt());
        assertEquals(session.getTeacher().getId(), dto.getTeacher_id());  // Vérifie l'ID de l'enseignant
        assertEquals(2, dto.getUsers().size());  // Vérifie qu'il y a deux utilisateurs dans le DTO
        assertEquals(3L, dto.getUsers().get(0));  // Vérifie l'ID du premier utilisateur dans le DTO
        assertEquals(4L, dto.getUsers().get(1));  // Vérifie l'ID du second utilisateur dans le DTO
    }

    @Test  // Test pour vérifier la conversion d'une liste de DTO en liste d'entités
    public void testToEntityList() throws ParseException {
        // Création de deux objets SessionDto avec des données fictives
        SessionDto dto1 = new SessionDto();
        dto1.setId(1L);
        dto1.setName("Session 1");
        dto1.setDescription("Description 1");
        dto1.setDate(dateFormat.parse("2024-08-20T21:33:08"));
        dto1.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        dto1.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        dto1.setTeacher_id(2L);
        dto1.setUsers(Arrays.asList(3L, 4L));

        SessionDto dto2 = new SessionDto();
        dto2.setId(2L);
        dto2.setName("Session 2");
        dto2.setDescription("Description 2");
        dto2.setDate(dateFormat.parse("2024-08-21T21:33:08"));
        dto2.setCreatedAt(LocalDateTime.parse("2024-08-21T21:33:08"));
        dto2.setUpdatedAt(LocalDateTime.parse("2024-08-21T21:33:08"));
        dto2.setTeacher_id(3L);
        dto2.setUsers(Collections.singletonList(5L));

        // Création de mocks pour les enseignants et les utilisateurs
        Teacher teacher1 = new Teacher();
        teacher1.setId(2L);
        Teacher teacher2 = new Teacher();
        teacher2.setId(3L);

        when(teacherService.findById(2L)).thenReturn(teacher1);
        when(teacherService.findById(3L)).thenReturn(teacher2);

        User user1 = new User();
        user1.setId(3L);
        User user2 = new User();
        user2.setId(4L);
        User user3 = new User();
        user3.setId(5L);

        when(userService.findById(3L)).thenReturn(user1);
        when(userService.findById(4L)).thenReturn(user2);
        when(userService.findById(5L)).thenReturn(user3);

        // Liste de DTO
        List<SessionDto> dtoList = Arrays.asList(dto1, dto2);

        // Conversion de la liste de DTO en liste d'entités
        List<Session> sessionList = sessionMapper.toEntity(dtoList);

        // Assertions pour vérifier que la conversion s'est faite correctement
        assertEquals(dtoList.size(), sessionList.size());
        assertEquals(dtoList.get(0).getId(), sessionList.get(0).getId());
        assertEquals(dtoList.get(1).getId(), sessionList.get(1).getId());
    }

    @Test  // Test pour vérifier la conversion d'une liste d'entités en liste de DTO
    public void testToDtoList() throws ParseException {
        // Création de mocks pour les enseignants et les utilisateurs
        Teacher teacher1 = new Teacher();
        teacher1.setId(2L);

        User user1 = new User();
        user1.setId(3L);
        User user2 = new User();
        user2.setId(4L);

        // Création d'objets Session avec des données fictives
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Session 1");
        session1.setDescription("Description 1");
        session1.setDate(dateFormat.parse("2024-08-20T21:33:08"));
        session1.setCreatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        session1.setUpdatedAt(LocalDateTime.parse("2024-08-20T21:33:08"));
        session1.setTeacher(teacher1);
        session1.setUsers(Arrays.asList(user1, user2));

        Session session2 = new Session();
        session2.setId(2L);
        session2.setName("Session 2");
        session2.setDescription("Description 2");
        session2.setDate(dateFormat.parse("2024-08-21T21:33:08"));
        session2.setCreatedAt(LocalDateTime.parse("2024-08-21T21:33:08"));
        session2.setUpdatedAt(LocalDateTime.parse("2024-08-21T21:33:08"));
        session2.setTeacher(null);
        session2.setUsers(Collections.singletonList(user2));

        // Liste d'entités
        List<Session> sessionList = Arrays.asList(session1, session2);

        // Conversion de la liste d'entités en liste de DTO
        List<SessionDto> dtoList = sessionMapper.toDto(sessionList);

        // Assertions pour vérifier que la conversion s'est faite correctement
        assertEquals(sessionList.size(), dtoList.size());
        assertEquals(sessionList.get(0).getId(), dtoList.get(0).getId());
        assertEquals(sessionList.get(1).getId(), dtoList.get(1).getId());
    }
}
