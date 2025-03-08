package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/session")
public class SessionController {

    private static final Logger log = LoggerFactory.getLogger(SessionController.class);

    private final SessionService sessionService;
    private final SessionMapper sessionMapper;

    public SessionController(SessionService sessionService, SessionMapper sessionMapper) {
        this.sessionService = sessionService;
        this.sessionMapper = sessionMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") String id) {
        try {
            Session session = this.sessionService.getById(Long.parseLong(id));
            if (session == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(this.sessionMapper.toDto(session));
        } catch (NumberFormatException e) {
            log.error("ID invalide : {}", id, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping()
    public ResponseEntity<?> findAll() {
        List<Session> sessions = this.sessionService.findAll();
        return ResponseEntity.ok().body(this.sessionMapper.toDto(sessions));
    }

    @PostMapping()
    public ResponseEntity<?> create(@Valid @RequestBody SessionDto sessionDto) {
        log.info("Création d'une session : {}", sessionDto);
        Session session = this.sessionService.create(this.sessionMapper.toEntity(sessionDto));
        log.info("Session créée avec succès : {}", session);
        return ResponseEntity.ok().body(this.sessionMapper.toDto(session));
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @Valid @RequestBody SessionDto sessionDto) {
        try {
            Session session = this.sessionService.update(Long.parseLong(id), this.sessionMapper.toEntity(sessionDto));
            return ResponseEntity.ok().body(this.sessionMapper.toDto(session));
        } catch (NumberFormatException e) {
            log.error("Échec de la mise à jour, ID invalide : {}", id, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {
        try {
            Session session = this.sessionService.getById(Long.parseLong(id));
            if (session == null) {
                return ResponseEntity.notFound().build();
            }
            this.sessionService.delete(Long.parseLong(id));
            log.info("Session supprimée avec succès : ID {}", id);
            return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            log.error("Échec de la suppression, ID invalide : {}", id, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("{id}/participate/{userId}")
    public ResponseEntity<?> participate(@PathVariable("id") String id, @PathVariable("userId") String userId) {
        try {
            this.sessionService.participate(Long.parseLong(id), Long.parseLong(userId));
            log.info("Utilisateur {} a rejoint la session {}", userId, id);
            return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            log.error("Erreur de participation, ID invalide : session={}, user={}", id, userId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("{id}/participate/{userId}")
    public ResponseEntity<?> noLongerParticipate(@PathVariable("id") String id, @PathVariable("userId") String userId) {
        try {
            this.sessionService.noLongerParticipate(Long.parseLong(id), Long.parseLong(userId));
            log.info("Utilisateur {} a quitté la session {}", userId, id);
            return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            log.error("Erreur de désinscription, ID invalide : session={}, user={}", id, userId, e);
            return ResponseEntity.badRequest().build();
        }
    }
}
