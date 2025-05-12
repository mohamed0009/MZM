package com.mzm.pharmaflow;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PharmaFlowApplication {
    public static void main(String[] args) {
        SpringApplication.run(PharmaFlowApplication.class, args);
    }
    
    @Bean
    public CommandLineRunner startupMessage() {
        return args -> {
            System.out.println("=======================================================");
            System.out.println("         PharmaFlow Backend Server Started");
            System.out.println("         API disponible sur: http://localhost:8080/api");
            System.out.println("         Test API: http://localhost:8080/api/test/echo");
            System.out.println("=======================================================");
        };
    }
} 