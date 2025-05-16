package com.openclassrooms.starterjwt.payload.request;

import javax.validation.constraints.*;
import java.util.Objects;

public class SignupRequest {

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(min = 3, max = 20)
  private String firstName;

  @NotBlank
  @Size(min = 3, max = 20)
  private String lastName;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;

  // Constructeur sans arguments
  public SignupRequest() {}

  // Constructeur avec arguments
  public SignupRequest(String email, String firstName, String lastName, String password) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }

  // Getters et setters
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
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

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  // equals
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SignupRequest that = (SignupRequest) o;
    return Objects.equals(email, that.email) &&
           Objects.equals(firstName, that.firstName) &&
           Objects.equals(lastName, that.lastName) &&
           Objects.equals(password, that.password);
  }

  // hashCode
  @Override
  public int hashCode() {
    return Objects.hash(email, firstName, lastName, password);
  }

  // canEqual
  public boolean canEqual(Object other) {
    return other instanceof SignupRequest;
  }

 // toString
  @Override
  public String toString() {
      return "SignupRequest{" +
              "email='" + email + '\'' +
              ", firstName='" + firstName + '\'' +
              ", lastName='" + lastName + '\'' +
              ", password='" + password + '\'' +
              '}';
}
}
