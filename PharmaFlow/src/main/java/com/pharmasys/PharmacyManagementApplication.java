package com.pharmasys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PharmacyManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PharmacyManagementApplication.class, args);
    }
}
