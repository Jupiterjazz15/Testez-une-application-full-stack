package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    private UserService userService;
    private UserMapper userMapper;
    private UserController userController;

    @BeforeEach
    void setup() {
        userService = mock(UserService.class);
        userMapper = mock(UserMapper.class);
        userController = new UserController(userService, userMapper);
    }

    // Test de récupération d'un utilisateur par ID (succès)
    @Test
    void findById_shouldReturnUserDto_whenUserExists() {
        User user = createUser(1L, "jane@example.com");
        UserDto userDto = new UserDto();

        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
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

    // Utilitaire : création d'un utilisateur
    private User createUser(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }
}
