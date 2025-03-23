package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class SessionRepositoryTest {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    // Ce test vérifie qu'une session peut être sauvegardée et retrouvée par son id.
    @Test
    public void testSaveAndFindById() {
        // Création d’un enseignant avec des dates en LocalDateTime
        Teacher teacher = new Teacher();
        teacher.setFirstName("Marie");
        teacher.setLastName("Curie");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());
        teacher = teacherRepository.save(teacher);

        // Création d’une session avec des dates en java.util.Date
        Session session = new Session();
        session.setName("Yoga du matin");
        session.setDescription("Session douce pour bien commencer la journée");
        session.setDate(new Date()); // java.util.Date
        session.setTeacher(teacher);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        Session savedSession = sessionRepository.save(session);
        Optional<Session> foundSession = sessionRepository.findById(savedSession.getId());

        assertThat(foundSession).isPresent();
        assertThat(foundSession.get().getName()).isEqualTo("Yoga du matin");
    }

    // Ce test vérifie que lorsqu'on recherche une session inexistante, on obtient un résultat vide.
    @Test
    public void testFindByIdNotFound() {
        Optional<Session> found = sessionRepository.findById(9999L);
        assertThat(found).isNotPresent();
    }

    // Ce test vérifie que l'on peut supprimer une session par son id.
    @Test
    public void testDeleteById() {
        Teacher teacher = new Teacher();
        teacher.setFirstName("Alan");
        teacher.setLastName("Turing");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());
        teacher = teacherRepository.save(teacher);

        Session session = new Session();
        session.setName("Séance spéciale");
        session.setDescription("Atelier intensif");
        session.setDate(new Date());
        session.setTeacher(teacher);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        session = sessionRepository.save(session);

        Long id = session.getId();
        sessionRepository.deleteById(id);
        Optional<Session> deleted = sessionRepository.findById(id);

        assertThat(deleted).isNotPresent();
    }

    // Ce test vérifie que l'on peut lier des utilisateurs à une session (test de la relation ManyToMany).
    @Test
    public void testAddParticipant() {
        Teacher teacher = new Teacher();
        teacher.setFirstName("Ada");
        teacher.setLastName("Lovelace");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());
        teacher = teacherRepository.save(teacher);

        User user = new User();
        user.setEmail("participant@example.com");
        user.setPassword("password");
        user.setFirstName("Jean");
        user.setLastName("Dupont");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        Session session = new Session();
        session.setName("Yoga Flow");
        session.setDescription("Enchaînement dynamique");
        session.setDate(new Date());
        session.setTeacher(teacher);
        session.setUsers(Collections.singletonList(user)); // ✅ correspond à la propriété `users`
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        session = sessionRepository.save(session);

        Optional<Session> found = sessionRepository.findById(session.getId());

        assertThat(found).isPresent();
        assertThat(
                found.get().getUsers()
                        .stream()
                        .map(User::getId)
                        .toList()
        ).contains(user.getId());
    }
}
