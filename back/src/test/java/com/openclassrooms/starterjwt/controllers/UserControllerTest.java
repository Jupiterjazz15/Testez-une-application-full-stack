package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

// imports JUnit 5 pour structurer les tests.
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

// imports des classes Spring pour simuler le contexte de sécurité.
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat; // assertions élégantes avec AssertJ
import static org.mockito.Mockito.*;// utilitaires de Mockito pour simuler les comportements.

public class UserControllerTest {

    private UserService userService;
    private UserMapper userMapper;
    private UserController userController;

    @BeforeEach
    void setup() {
        userService = mock(UserService.class); // création d'un mock UserService
        userMapper = mock(UserMapper.class); // création d'un mock userMapper
        userController = new UserController(userService, userMapper); // injection de ces dépendances simulées dans un vrai UserController.
    }

    // Utilitaire : création d'un utilisateur
    private User createUser(Long id, String email) { // Spring Data JPA et Hibernate utilise Long par défaut pour les id
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    // Test de récupération d'un utilisateur par ID (succès)
    @Test
    void findById_shouldReturnUserDto_whenUserExists() {

        User user = createUser(1L, "jane@example.com"); // utilisation d'un Long
        UserDto userDto = new UserDto();  // Création d'un objet UserDto (simulé ici comme résultat du mapping)

        when(userService.findById(1L)).thenReturn(user); // Simulation comportement du service : si on cherche l'utilisateur avec l'ID 1, on retourne l'objet "user"

        // Simulation du comportement du mapper : si on convertit l'objet "user", on retourne "userDto"
        when(userMapper.toDto(user)).thenReturn(userDto);

        // Appel réel de la méthode "findById" du contrôleur avec l'ID "1" (au format String)
        ResponseEntity<?> response = userController.findById("1");

        // Vérifie que le code HTTP de la réponse est bien 200 (OK)
        assertThat(response.getStatusCodeValue()).isEqualTo(200);

        // Vérifie que le corps de la réponse correspond exactement à l'objet "userDto" simulé
        assertThat(response.getBody()).isEqualTo(userDto);
    }

    // Test de récupération par ID (utilisateur non trouvé)
    @Test
    void findById_shouldReturnNotFound_whenUserDoesNotExist() {
        when(userService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = userController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    // Test de récupération par ID (format ID invalide)
    @Test
    void findById_shouldReturnBadRequest_whenIdIsInvalid() {
        ResponseEntity<?> response = userController.findById("abc");

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

    // Test de suppression avec autorisation valide
    @Test
    void deleteUser_shouldReturnOk_whenUserIsOwner() {
        User user = createUser(1L, "user@example.com");

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("user@example.com")
                .password("pass")
                .authorities("USER")
                .build();

        SecurityContextHolder.getContext().setAuthentication(
                new TestingAuthenticationToken(userDetails, null)
        );

        when(userService.findById(1L)).thenReturn(user);

        ResponseEntity<?> response = userController.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(userService).delete(1L);
    }

    // Test de suppression avec un autre utilisateur (UNAUTHORIZED)
    @Test
    void deleteUser_shouldReturnUnauthorized_whenUserIsNotOwner() {
        User user = createUser(1L, "user@example.com");

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("someoneelse@example.com")
                .password("pass")
                .authorities("USER")
                .build();

        SecurityContextHolder.getContext().setAuthentication(
                new TestingAuthenticationToken(userDetails, null)
        );

        when(userService.findById(1L)).thenReturn(user);

        ResponseEntity<?> response = userController.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(401);
        verify(userService, never()).delete(1L);
    }

    // Test de suppression par ID (utilisateur non trouvé)
    @Test
    void deleteUser_shouldReturnNotFound_whenUserDoesNotExist() {
        when(userService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = userController.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    // Test de récupération par email
    @Test
    void findByEmail_shouldReturnUserDto_whenUserExists() {
        User user = createUser(1L, "test@example.com");
        UserDto userDto = new UserDto();

        when(userService.findByEmail("test@example.com")).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = userController.findByEmail("test@example.com");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(userDto);
    }

    // Test de suppression par email
    @Test
    void deleteByEmail_shouldReturnOk_whenUserExists() {
        User user = createUser(1L, "test@example.com");

        when(userService.findByEmail("test@example.com")).thenReturn(user);

        ResponseEntity<?> response = userController.deleteByEmail("test@example.com");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(userService).delete(user.getId());
    }

    // TESTS SUPPLEMENTAIRES
    @Test
    void deleteByEmail_shouldReturnNotFound_whenUserDoesNotExist() {
        when(userService.findByEmail("nonexistent@example.com")).thenReturn(null);

        ResponseEntity<?> response = userController.deleteByEmail("nonexistent@example.com");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    @Test
    void deleteUser_shouldReturnBadRequest_whenIdIsInvalid() {
        ResponseEntity<?> response = userController.save("abc"); // "abc" n’est pas convertible en Long

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

}
