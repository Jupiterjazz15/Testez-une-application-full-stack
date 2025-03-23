package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SessionServiceTest {

    private SessionRepository sessionRepository;
    private UserRepository userRepository;
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        sessionRepository = mock(SessionRepository.class);
        userRepository = mock(UserRepository.class);
        sessionService = new SessionService(sessionRepository, userRepository);
    }

    // Test de création d'une session
    @Test
    void create_shouldReturnSavedSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.create(session);

        assertThat(result).isEqualTo(session);
        verify(sessionRepository).save(session);
    }

    // Test de suppression d'une session par ID
    @Test
    void delete_shouldCallRepositoryDeleteById() {
        Long sessionId = 1L;
        sessionService.delete(sessionId);
        verify(sessionRepository).deleteById(sessionId);
    }

    // Test de récupération de toutes les sessions
    @Test
    void findAll_shouldReturnAllSessions() {
        List<Session> sessions = List.of(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertThat(result).hasSize(2);
    }

    // Test de récupération d'une session par ID si elle existe
    @Test
    void getById_shouldReturnSessionIfFound() {
        Long id = 1L;
        Session session = new Session();
        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(id);

        assertThat(result).isEqualTo(session);
    }

    // Test de récupération d'une session par ID si elle n'existe pas
    @Test
    void getById_shouldReturnNullIfNotFound() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        Session result = sessionService.getById(42L);

        assertThat(result).isNull();
    }

    // Test de mise à jour d'une session
    @Test
    void update_shouldSaveAndReturnUpdatedSession() {
        Session session = new Session();
        Long id = 1L;
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.update(id, session);

        assertThat(result).isEqualTo(session);
        assertThat(session.getId()).isEqualTo(id);
        verify(sessionRepository).save(session);
    }

    // Test d'ajout d'un participant
    @Test
    void participate_shouldAddUserToSession() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(sessionRepository.save(session)).thenReturn(session);

        sessionService.participate(sessionId, userId);

        assertThat(session.getUsers()).contains(user);
    }

    // Test d'ajout d'un participant déjà inscrit
    @Test
    void participate_shouldThrowBadRequestIfUserAlreadyParticipates() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
    }

    // Test si l'utilisateur ou la session n'existe pas
    @Test
    void participate_shouldThrowNotFoundIfSessionOrUserIsNull() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> sessionService.participate(1L, 2L))
                .isInstanceOf(NotFoundException.class);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(new Session()));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> sessionService.participate(1L, 2L))
                .isInstanceOf(NotFoundException.class);
    }

    // Test de suppression de participation d'un utilisateur
    @Test
    void noLongerParticipate_shouldRemoveUserFromSession() {
        Long userId = 1L;
        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(session)).thenReturn(session);

        sessionService.noLongerParticipate(1L, userId);

        assertThat(session.getUsers()).doesNotContain(user);
    }

    // Test si l'utilisateur ne participe pas
    @Test
    void noLongerParticipate_shouldThrowBadRequestIfUserNotParticipant() {
        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 1L))
                .isInstanceOf(BadRequestException.class);
    }

    // Test si la session n'existe pas pour retirer un participant
    @Test
    void noLongerParticipate_shouldThrowNotFoundIfSessionNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
    }
}
