package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.mockito.Mockito.*;

import org.springframework.boot.SpringApplication;

@SpringBootTest
public class SpringBootSecurityJwtApplicationTests {

	@Test
	public void contextLoads() {
	}

	@Test
	public void testMainMethod() {
		SpringApplication mockSpringApplication = mock(SpringApplication.class);
		SpringBootSecurityJwtApplication.main(new String[]{});
	}
}
