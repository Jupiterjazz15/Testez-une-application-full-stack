package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        userService = new UserService(userRepository);
    }

    // Ce test vérifie que le service supprime bien un utilisateur en appelant le repository avec le bon ID.
    @Test
    void testDelete() {
        Long id = 1L;
        userService.delete(id);
        verify(userRepository, times(1)).deleteById(id);
    }

    // Ce test vérifie que le service retourne un utilisateur existant trouvé par son ID.
    @Test
    void testFindByIdReturnsUser() {
        Long id = 1L;
        User user = new User();
        user.setId(id);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        User result = userService.findById(id);
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
    }

    // Ce test vérifie que le service retourne null si aucun utilisateur n'est trouvé par ID.
    @Test
    void testFindByIdReturnsNull() {
        Long id = 2L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        User result = userService.findById(id);
        assertThat(result).isNull();
    }

    // Ce test vérifie que le service retourne un utilisateur trouvé par email.
    @Test
    void testFindByEmailReturnsUser() {
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User result = userService.findByEmail(email);
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
    }

    // Ce test vérifie que le service retourne null si aucun utilisateur n'est trouvé par email.
    @Test
    void testFindByEmailReturnsNull() {
        String email = "unknown@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        User result = userService.findByEmail(email);
        assertThat(result).isNull();
    }
}
