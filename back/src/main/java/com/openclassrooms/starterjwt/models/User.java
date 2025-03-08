package com.openclassrooms.starterjwt.models;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "USERS", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@EntityListeners(AuditingEntityListener.class)
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Size(max = 50)
  @Email
  private String email;

  @Size(max = 20)
  @Column(name = "last_name")
  private String lastName;

  @Size(max = 20)
  @Column(name = "first_name")
  private String firstName;

  @Size(max = 120)
  private String password;

  private boolean admin;

  @CreatedDate
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  // Constructeur par défaut (obligatoire pour JPA)
  public User() {}

  // Nouveau constructeur sans `id`, `createdAt`, et `updatedAt`
  public User(String email, String lastName, String firstName, String password, boolean admin) {
    this.email = email;
    this.lastName = lastName;
    this.firstName = firstName;
    this.password = password;
    this.admin = admin;
  }

  // Constructeur complet (optionnel)
  public User(Long id, String email, String lastName, String firstName, String password, boolean admin, LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.id = id;
    this.email = email;
    this.lastName = lastName;
    this.firstName = firstName;
    this.password = password;
    this.admin = admin;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getters
  public Long getId() { return id; }
  public String getEmail() { return email; }
  public String getLastName() { return lastName; }
  public String getFirstName() { return firstName; }
  public String getPassword() { return password; }
  public boolean isAdmin() { return admin; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }

  // Setters
  public void setId(Long id) { this.id = id; }
  public void setEmail(String email) { this.email = email; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public void setPassword(String password) { this.password = password; }
  public void setAdmin(boolean admin) { this.admin = admin; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
