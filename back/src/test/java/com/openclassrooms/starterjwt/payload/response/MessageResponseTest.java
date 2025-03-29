package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MessageResponseTest {

    @Test
    void testConstructorAndGetMessage() {
        String expectedMessage = "Operation réussie";
        MessageResponse response = new MessageResponse(expectedMessage);

        assertEquals(expectedMessage, response.getMessage());
    }

    @Test
    void testSetMessage() {
        MessageResponse response = new MessageResponse("Ancien message");
        response.setMessage("Nouveau message");

        assertEquals("Nouveau message", response.getMessage());
    }
}
