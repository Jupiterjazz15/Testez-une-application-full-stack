package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password");
        user.setAdmin(false);

        session = new Session();
        session.setId(1L);
        session.setName("Session 1");
        session.setDate(new Date());
        session.setDescription("Description 1");
        session.setUsers(new ArrayList<>());
    }

    @Test
    void testCreate() {
        // mocke le comportement
        when(sessionRepository.save(any(Session.class))).thenReturn(session);
        // Quand la méthode save(...) du repository est appelée avec n’importe quelle Session, retourne l'objet session

        Session createdSession = sessionService.create(session);

        assertNotNull(createdSession);
        assertEquals(session.getName(), createdSession.getName());
        verify(sessionRepository, times(1)).save(session);
        //Vérifie que la mthd save() du repo a été appelée une seule fois et avec l’objet exact session.
    }

    @Test
    void testDelete() {
        doNothing().when(sessionRepository).deleteById(anyLong());
        // quand la méthode deleteById(...) est appelée avec n'importe quel Long, ne fais rien (évite une vraie suppression, car on est dans un test

        sessionService.delete(1L);

        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    void testFindAll() {
        when(sessionRepository.findAll()).thenReturn(Arrays.asList(session));

        List<Session> sessions = sessionService.findAll();

        assertNotNull(sessions);
        assertFalse(sessions.isEmpty());
        assertEquals(1, sessions.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void testGetById() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Session foundSession = sessionService.getById(1L);

        assertNotNull(foundSession);
        assertEquals(session.getName(), foundSession.getName());
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void testGetById_NotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        Session foundSession = sessionService.getById(1L);

        assertNull(foundSession);
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void testUpdate() {
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        Session updatedSession = sessionService.update(1L, session);

        assertNotNull(updatedSession);
        assertEquals(session.getName(), updatedSession.getName());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipate() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        sessionService.participate(1L, 1L);

        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipate_UserNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));

        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testParticipate_AlreadyParticipates() {
        session.setUsers(Arrays.asList(user));
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));

        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testNoLongerParticipate() {
        session.setUsers(new ArrayList<>(Arrays.asList(user)));
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        sessionService.noLongerParticipate(1L, 1L);

        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testNoLongerParticipate_SessionNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));

        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testNoLongerParticipate_NotParticipating() {
        session.setUsers(new ArrayList<>()); // vide
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));

        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, never()).save(any(Session.class));
    }
}
