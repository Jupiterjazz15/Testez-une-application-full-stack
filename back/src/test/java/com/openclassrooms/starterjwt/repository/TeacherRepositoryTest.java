package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest // Indique qu'on lance le test avec le contexte Spring complet
@Transactional   // Chaque test sera exécuté dans une transaction...
@Rollback         // ...qui sera annulée à la fin du test (base de données inchangée)
public class TeacherRepositoryTest {

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    void testSaveAndFindById() {
        // 💡 Étape 1 : Création d'un objet Teacher
        Teacher teacher = new Teacher();
        teacher.setFirstName("Marie");
        teacher.setLastName("Curie");

        // 💾 Étape 2 : Sauvegarde dans la base via le repository
        Teacher saved = teacherRepository.save(teacher);

        // 🔍 Étape 3 : Récupération de l'objet via son id
        Optional<Teacher> result = teacherRepository.findById(saved.getId());

        // ✅ Étape 4 : Vérifications
        assertThat(result).isPresent(); // L'objet doit exister
        assertThat(result.get().getFirstName()).isEqualTo("Marie"); // Prénom correct
        assertThat(result.get().getLastName()).isEqualTo("Curie");  // Nom correct
    }

    @Test
    void testFindByIdNotFound() {
        // 🔍 Recherche d'un ID inexistant
        Optional<Teacher> result = teacherRepository.findById(9999L);

        // ✅ Vérification que rien n'est trouvé
        assertThat(result).isEmpty();
    }
}
