package com.openclassrooms.starterjwt.models;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "TEACHERS")
@EntityListeners(AuditingEntityListener.class)
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    @Column(name = "last_name")
    private String lastName;

    @NotBlank
    @Size(max = 20)
    @Column(name = "first_name")
    private String firstName;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // -------------------------
    // Constructeurs
    // -------------------------

    public Teacher() {}

    public Teacher(String lastName, String firstName) {
        this.lastName = lastName;
        this.firstName = firstName;
    }

    public Teacher(Long id, String lastName, String firstName, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // -------------------------
    // Getters et Setters
    // -------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
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

    // -------------------------
    // equals et hashCode (basés sur id)
    // -------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Teacher)) return false;
        Teacher teacher = (Teacher) o;
        return Objects.equals(id, teacher.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // -------------------------
    // toString
    // -------------------------

    @Override
    public String toString() {
        return "Teacher(" +
                "id=" + id +
                ", lastName=" + lastName +
                ", firstName=" + firstName +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ")";
    }
}
