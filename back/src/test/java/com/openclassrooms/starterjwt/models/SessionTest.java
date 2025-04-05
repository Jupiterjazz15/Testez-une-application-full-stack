package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class SessionTest {

    @Test
    void testSessionConstructorAndGetters() {
        Long id = 1L;
        String name = "Séance Yoga";
        Date date = new Date();
        String description = "Description de la séance";
        Teacher teacher = new Teacher();
        User user1 = new User();
        User user2 = new User();
        List<User> users = Arrays.asList(user1, user2);
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        Session session = new Session(id, name, date, description, teacher, users, createdAt, updatedAt);

        assertThat(session.getId()).isEqualTo(id);
        assertThat(session.getName()).isEqualTo(name);
        assertThat(session.getDate()).isEqualTo(date);
        assertThat(session.getDescription()).isEqualTo(description);
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).isEqualTo(users);
        assertThat(session.getCreatedAt()).isEqualTo(createdAt);
        assertThat(session.getUpdatedAt()).isEqualTo(updatedAt);
    }

    @Test
    void testSetters() {
        Session session = new Session();
        LocalDateTime now = LocalDateTime.now();
        Date date = new Date();
        Teacher teacher = new Teacher();
        User user = new User();
        List<User> users = List.of(user);

        session.setId(2L);
        session.setName("Yoga du soir");
        session.setDate(date);
        session.setDescription("Relaxation profonde");
        session.setTeacher(teacher);
        session.setUsers(users);
        session.setCreatedAt(now);
        session.setUpdatedAt(now);

        assertThat(session.getId()).isEqualTo(2L);
        assertThat(session.getName()).isEqualTo("Yoga du soir");
        assertThat(session.getDate()).isEqualTo(date);
        assertThat(session.getDescription()).isEqualTo("Relaxation profonde");
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).isEqualTo(users);
        assertThat(session.getCreatedAt()).isEqualTo(now);
        assertThat(session.getUpdatedAt()).isEqualTo(now);
    }
}
