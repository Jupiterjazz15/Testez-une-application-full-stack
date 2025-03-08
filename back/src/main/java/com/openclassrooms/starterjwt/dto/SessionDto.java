package com.openclassrooms.starterjwt.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class SessionDto {
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotNull
    private Date date;

    @NotNull
    private Long teacher_id;

    @NotNull
    @Size(max = 2500)
    private String description;

    private List<Long> users;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructeur sans argument
    public SessionDto() {}

    // Constructeur avec tous les arguments
    public SessionDto(Long id, String name, Date date, Long teacher_id, String description, List<Long> users, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.teacher_id = teacher_id;
        this.description = description;
        this.users = users;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getTeacher_id() {
        return teacher_id;
    }

    public void setTeacher_id(Long teacher_id) {
        this.teacher_id = teacher_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Long> getUsers() {
        return users;
    }

    public void setUsers(List<Long> users) {
        this.users = users;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Méthode toString pour affichage
    @Override
    public String toString() {
        return "SessionDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", date=" + date +
                ", teacher_id=" + teacher_id +
                ", description='" + description + '\'' +
                ", users=" + users +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
