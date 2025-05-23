package com.openclassrooms.starterjwt.payload.response;

public class JwtResponse {

  private String token;
  private String type = "Bearer";
  private Long id;
  private String username;
  private String firstName;
  private String lastName;
  private Boolean admin;

  // === Constructeur ===
  public JwtResponse(String accessToken, Long id, String username, String firstName, String lastName, Boolean admin) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.admin = admin;
  }

  // === Getters et Setters ===

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public Boolean isAdmin() {
    return admin;
  }

  public void setAdmin(Boolean admin) {
    this.admin = admin;
  }
}
