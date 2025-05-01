package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User; // Importation du modèle User pour la création d'un utilisateur
import com.openclassrooms.starterjwt.repository.UserRepository; // Importation de UserRepository pour accéder à la base de données des utilisateurs
import com.openclassrooms.starterjwt.services.UserService; // Importation de UserService pour la logique métier liée aux utilisateurs

import org.junit.jupiter.api.BeforeEach; // Importation de BeforeEach pour initialiser des données avant chaque test
import org.junit.jupiter.api.Test; // Importation de Test pour indiquer que cette méthode est un test unitaire

import org.springframework.beans.factory.annotation.Autowired; // Importation de Autowired pour l'injection de dépendances
import org.springframework.boot.test.context.SpringBootTest; // Importation pour charger le contexte Spring et initialiser le test
import org.springframework.http.MediaType; // Importation pour spécifier le type MIME des requêtes et des réponses

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; // Importation pour configurer MockMvc
import org.springframework.boot.test.mock.mockito.MockBean; // Importation pour mocker des services ou des dépendances
import org.springframework.security.test.context.support.WithMockUser; // Importation pour définir un utilisateur simulé dans le contexte de sécurité
import org.springframework.test.web.servlet.MockMvc; // Importation pour simuler des requêtes HTTP dans les tests d'intégration
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders; // Importation pour construire des requêtes HTTP dans MockMvc

import static org.mockito.Mockito.when; // Importation pour utiliser Mockito et simuler des comportements des services
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*; // Importation pour vérifier les résultats des tests (statut HTTP, contenu, etc.)

@SpringBootTest // Cette annotation permet de charger le contexte Spring et d'exécuter le test avec les beans de l'application.
@AutoConfigureMockMvc // Configure MockMvc pour pouvoir tester les contrôleurs web avec des requêtes HTTP simulées.
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc; // Injection de MockMvc pour simuler des requêtes HTTP dans le test

    @MockBean
    private UserService userService; // Simule le service UserService pour les tests d'intégration sans utiliser la vraie logique métier

    @MockBean
    private UserRepository userRepository; // Simule le repository UserRepository pour éviter d'interagir avec la base de données réelle

    @BeforeEach
    void setUp() {
        User user = new User(); // Création d'un utilisateur fictif pour les tests
        user.setId(1L); // Attribuer un ID à l'utilisateur
        user.setEmail("john.doe@example.com"); // Définir l'email de l'utilisateur
        user.setLastName("Doe"); // Définir le nom de famille de l'utilisateur
        user.setFirstName("John"); // Définir le prénom de l'utilisateur
        user.setPassword("password"); // Définir le mot de passe de l'utilisateur
        user.setAdmin(true); // Définir le rôle admin de l'utilisateur

        // Simuler la méthode findById du service pour qu'elle retourne un utilisateur avec l'ID 1
        when(userService.findById(1L)).thenReturn(user);
    }

    @Test
    @WithMockUser(username = "john.doe@example.com") // Cette annotation permet de simuler un utilisateur authentifié dans les tests
    void testFindById_UserExists() throws Exception {
        // Tester le cas où l'utilisateur existe
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/1") // Simulatio une requête GET sur l'API avec mockMVC
                .contentType(MediaType.APPLICATION_JSON)) // Spécifier que le type de contenu attendu est JSON
                .andExpect(status().isOk()) // Vérifier que la réponse a un statut HTTP 200 (OK)
                .andExpect(content().json("{\"id\":1,\"email\":\"john.doe@example.com\",\"lastName\":\"Doe\",\"firstName\":\"John\"}")); // Vérifier que le contenu de la réponse correspond aux données de l'utilisateur
    }

    @Test // Test pour vérifier la gestion d'un utilisateur inexistant
    @WithMockUser(username = "john.doe@example.com") // Simuler un utilisateur authentifié
    void testFindById_UserDoesNotExist() throws Exception {
        // Simuler que l'utilisateur avec l'ID 99 n'existe pas en ne modifiant pas la méthode findById (pas de mock ici)
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/99") // Effectuer une requête GET pour un utilisateur inexistant
                        .contentType(MediaType.APPLICATION_JSON)) // Spécifier le type de contenu JSON
                .andExpect(status().isNotFound()); // Vérifier que la réponse a un statut HTTP 404 (Non trouvé)
    }

    @Test // Test pour vérifier la gestion d'un ID invalide dans l'URL
    @WithMockUser(username = "john.doe@example.com") // Simuler un utilisateur authentifié
    void testFindById_InvalidId() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/invalid") // Effectuer une requête GET avec un ID invalide dans l'URL
                        .contentType(MediaType.APPLICATION_JSON)) // Spécifier le type de contenu JSON
                .andExpect(status().isBadRequest()); // Vérifier que la réponse a un statut HTTP 400 (Mauvaise requête)
    }

    @Test // Test pour vérifier la suppression d'un utilisateur existant
    @WithMockUser(username = "john.doe@example.com") // Simuler un utilisateur authentifié
    void testDelete_UserExists() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/1") // Effectuer une requête DELETE pour supprimer l'utilisateur avec l'ID 1
                        .contentType(MediaType.APPLICATION_JSON)) // Spécifier le type de contenu JSON
                .andExpect(status().isOk()); // Vérifier que la réponse a un statut HTTP 200 (OK)
    }

    @Test // Test pour vérifier la suppression d'un utilisateur inexistant
    @WithMockUser(username = "john.doe@example.com") // Simuler un utilisateur authentifié
    void testDelete_UserDoesNotExist() throws Exception {
        // Simuler que l'utilisateur avec l'ID 99 n'existe pas en ne modifiant pas la méthode findById (pas de mock ici)
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/99") // Effectuer une requête DELETE pour un utilisateur inexistant
                        .contentType(MediaType.APPLICATION_JSON)) // Spécifier le type de contenu JSON
                .andExpect(status().isNotFound()); // Vérifier que la réponse a un statut HTTP 404 (Non trouvé)
    }

    @Test // Test pour vérifier la gestion de l'accès non autorisé (utilisateur non autorisé pour supprimer un autre utilisateur)
    @WithMockUser(username = "different.user@example.com") // Simuler un utilisateur différent (non autorisé)
    void testDelete_Unauthorized() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/1") // Effectuer une requête DELETE pour supprimer un autre utilisateur
                        .contentType(MediaType.APPLICATION_JSON)) // Spécifier le type de contenu JSON
                .andExpect(status().isUnauthorized()); // Vérifier que la réponse a un statut HTTP 401 (Non autorisé)
    }

    @Test // Test pour vérifier la gestion d'un ID invalide lors de la suppression
    @WithMockUser(username = "john.doe@example.com") // Simuler un utilisateur authentifié
    void testDelete_InvalidId() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/invalid") // Effectuer une requête DELETE avec un ID invalide dans l'URL
                        .contentType(MediaType.APPLICATION_JSON)) // Spécifier le type de contenu JSON
                .andExpect(status().isBadRequest()); // Vérifier que la réponse a un statut HTTP 400 (Mauvaise requête)
    }
}
