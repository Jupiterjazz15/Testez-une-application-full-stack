package com.openclassrooms.starterjwt.security.jwt;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;

import java.lang.reflect.Field;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtUtils = new JwtUtils();

        setField(jwtUtils, "jwtSecret", "testSecretKey");
        setField(jwtUtils, "jwtExpirationMs", 86400000);
    }

    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testGenerateJwtToken() {

        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "username", "John", "Doe", false,"password");
        when(authentication.getPrincipal()).thenReturn(userDetails);


        String token = jwtUtils.generateJwtToken(authentication);


        assertNotNull(token);
        assertTrue(token.startsWith("eyJ"));
    }

    @Test
    public void testGetUserNameFromJwtToken() {

        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000))
                .signWith(SignatureAlgorithm.HS512, "testSecretKey")
                .compact();


        String username = jwtUtils.getUserNameFromJwtToken(token);


        assertEquals("username", username);
    }

    @Test
    public void testValidateJwtToken_ValidToken() {

        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000))
                .signWith(SignatureAlgorithm.HS512, "testSecretKey")
                .compact();


        boolean isValid = jwtUtils.validateJwtToken(token);


        assertTrue(isValid);
    }

    @Test
    public void testValidateJwtToken_InvalidSignature() {

        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000))
                .signWith(SignatureAlgorithm.HS512, "wrongSecret")
                .compact();


        boolean isValid = jwtUtils.validateJwtToken(token);


        assertFalse(isValid);
    }

    @Test
    public void testValidateJwtToken_ExpiredToken() {

        String token = Jwts.builder()
                .setSubject("username")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() - 1000))
                .signWith(SignatureAlgorithm.HS512, "testSecretKey")
                .compact();


        boolean isValid = jwtUtils.validateJwtToken(token);


        assertFalse(isValid);
    }

    @Test
    public void testValidateJwtToken_MalformedToken() {

        boolean isValid = jwtUtils.validateJwtToken("malformedToken");


        assertFalse(isValid);
    }
}
