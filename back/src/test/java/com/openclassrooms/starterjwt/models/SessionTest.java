package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

public class SessionTest {

    @Test
    void testConstructorWithAllFields() {
        Long id = 1L;
        String name = "Séance Yoga";
        Date date = new Date();
        String description = "Description de la séance";
        Teacher teacher = new Teacher();
        List<User> users = Arrays.asList(new User(), new User());
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        Session session = new Session(id, name, date, description, teacher, users, createdAt, updatedAt);

        assertThat(session.getId()).isEqualTo(id);
        assertThat(session.getName()).isEqualTo(name);
        assertThat(session.getDate()).isEqualTo(date);
        assertThat(session.getDescription()).isEqualTo(description);
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).hasSize(2);
        assertThat(session.getCreatedAt()).isEqualTo(createdAt);
        assertThat(session.getUpdatedAt()).isEqualTo(updatedAt);
    }

    @Test
    void testConstructorWithoutIdAndAuditFields() {
        String name = "Séance du matin";
        Date date = new Date();
        String description = "Séance dynamique";
        Teacher teacher = new Teacher(1L, "Doe", "John", LocalDateTime.now(), LocalDateTime.now());
        List<User> users = Collections.singletonList(new User());

        Session session = new Session(name, date, description, teacher, users);

        assertThat(session.getName()).isEqualTo(name);
        assertThat(session.getDate()).isEqualTo(date);
        assertThat(session.getDescription()).isEqualTo(description);
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).isEqualTo(users);
    }

    @Test
    void testSetters() {
        Session session = new Session();
        Date date = new Date();
        LocalDateTime now = LocalDateTime.now();

        session.setId(2L);
        session.setName("Yoga du soir");
        session.setDate(date);
        session.setDescription("Relaxation profonde");
        session.setTeacher(new Teacher());
        session.setUsers(Collections.singletonList(new User()));
        session.setCreatedAt(now);
        session.setUpdatedAt(now);

        assertThat(session.getId()).isEqualTo(2L);
        assertThat(session.getName()).isEqualTo("Yoga du soir");
        assertThat(session.getDate()).isEqualTo(date);
        assertThat(session.getDescription()).isEqualTo("Relaxation profonde");
        assertThat(session.getTeacher()).isNotNull();
        assertThat(session.getUsers()).hasSize(1);
        assertThat(session.getCreatedAt()).isEqualTo(now);
        assertThat(session.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testToStringContainsBasicFields() {
        Session session = new Session();
        session.setId(10L);
        session.setName("Méditation");
        session.setDescription("Séance calme");
        session.setDate(new Date());

        String result = session.toString();

        assertThat(result).contains("id=10", "name=Méditation", "description=Séance calme");
    }

    @Test
    void testToStringContainsTeacherAndUsers() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = new Teacher(1L, "Dupont", "Alice", now, now);
        User user = new User("mail@test.com", "Nom", "Prénom", "pwd", false);

        Session session = new Session(5L, "Yoga", new Date(), "Matinale", teacher, List.of(user), now, now);

        String result = session.toString();

        assertThat(result).contains("teacher=1", "users=1");
    }


    @Test
    void testEquals_SameReference() {
        Session session = new Session();
        assertThat(session.equals(session)).isTrue();
    }

    @Test
    void testEquals_SameId() {
        Session s1 = new Session();
        Session s2 = new Session();
        s1.setId(1L);
        s2.setId(1L);

        assertThat(s1).isEqualTo(s2);
    }

    @Test
    void testEquals_DifferentId() {
        Session s1 = new Session();
        Session s2 = new Session();
        s1.setId(1L);
        s2.setId(2L);

        assertThat(s1).isNotEqualTo(s2);
    }

    @Test
    void testEquals_NullAndDifferentClass() {
        Session s1 = new Session();
        s1.setId(1L);

        assertThat(s1.equals(null)).isFalse();
        assertThat(s1.equals("not a session")).isFalse();
    }

    @Test
    void testEquals_BothNullIds() {
        Session s1 = new Session();
        Session s2 = new Session();

        assertThat(s1).isEqualTo(s2);
    }

    @Test
    void testHashCode_WithId() {
        Session s1 = new Session();
        s1.setId(99L);

        assertThat(s1.hashCode()).isEqualTo(Objects.hash(99L));
    }

    @Test
    void testHashCode_NullId() {
        Session s1 = new Session();
        assertThat(s1.hashCode()).isEqualTo(Objects.hash((Object) null));
    }
}
