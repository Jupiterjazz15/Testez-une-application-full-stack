package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@ActiveProfiles("test")
@Transactional
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Vérifie que findByEmail retourne un utilisateur si présent")
    void testFindByEmailReturnsUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setFirstName("Test");
        user.setLastName("User");

        userRepository.save(user);

        Optional<User> result = userRepository.findByEmail("test@example.com");

        assertTrue(result.isPresent());
        assertEquals("Test", result.get().getFirstName());
    }

    @Test
    @DisplayName("Vérifie que existsByEmail retourne true si l'email existe")
    void testExistsByEmailReturnsTrue() {
        User user = new User();
        user.setEmail("check@example.com");
        user.setPassword("pass123");
        user.setFirstName("Check");
        user.setLastName("Exist");

        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("check@example.com");

        assertTrue(exists);
    }

    @Test
    @DisplayName("Vérifie que existsByEmail retourne false si l'email n'existe pas")
    void testExistsByEmailReturnsFalse() {
        boolean exists = userRepository.existsByEmail("notfound@example.com");

        assertFalse(exists);
    }
}
