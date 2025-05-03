package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class TeacherTest {

  @Test
  void testConstructorWithNamesOnly() {
      Teacher teacher = new Teacher("Dupuis", "Claire");

      assertThat(teacher.getLastName()).isEqualTo("Dupuis");
      assertThat(teacher.getFirstName()).isEqualTo("Claire");
  }

    @Test
    void testNoArgsConstructor() {
        Teacher teacher = new Teacher();
        assertThat(teacher).isNotNull();
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        Teacher teacher = new Teacher(1L, "Dupont", "Jean", createdAt, updatedAt);

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getLastName()).isEqualTo("Dupont");
        assertThat(teacher.getFirstName()).isEqualTo("Jean");
        assertThat(teacher.getCreatedAt()).isEqualTo(createdAt);
        assertThat(teacher.getUpdatedAt()).isEqualTo(updatedAt);
    }

    @Test
    void testSettersAndGetters() {
        LocalDateTime now = LocalDateTime.now();

        Teacher teacher = new Teacher();
        teacher.setId(2L);
        teacher.setFirstName("Marie");
        teacher.setLastName("Durand");
        teacher.setCreatedAt(now);
        teacher.setUpdatedAt(now);

        assertThat(teacher.getId()).isEqualTo(2L);
        assertThat(teacher.getFirstName()).isEqualTo("Marie");
        assertThat(teacher.getLastName()).isEqualTo("Durand");
        assertThat(teacher.getCreatedAt()).isEqualTo(now);
        assertThat(teacher.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testEqualsAndHashCode() {
        LocalDateTime now = LocalDateTime.now();

        Teacher t1 = new Teacher(1L, "Nom", "Prénom", now, now);
        Teacher t2 = new Teacher(1L, "Autre", "Chose", now, now);
        Teacher t3 = new Teacher(2L, "Nom", "Prénom", now, now);

        assertThat(t1).isEqualTo(t2); // même id = égalité
        assertThat(t1).hasSameHashCodeAs(t2);

        assertThat(t1).isNotEqualTo(t3);
        assertNotEquals(t1.hashCode(), t3.hashCode());
    }

    @Test
    void testEqualsWithNullAndDifferentClass() {
        Teacher t1 = new Teacher();
        t1.setId(1L);

        assertThat(t1.equals(null)).isFalse();
        assertThat(t1.equals("not a teacher")).isFalse();
    }

    @Test
    void testEqualsWithNullIds() {
        Teacher t1 = new Teacher();
        Teacher t2 = new Teacher();

        assertThat(t1).isEqualTo(t2); // deux id nulls = égalité
    }

    @Test
    void testToStringContainsExpectedFields() {
        LocalDateTime now = LocalDateTime.now();

        Teacher teacher = new Teacher(3L, "Martin", "Lucie", now, now);

        String result = teacher.toString();
        assertThat(result).contains("id=3");
        assertThat(result).contains("lastName=Martin");
        assertThat(result).contains("firstName=Lucie");
    }
}
