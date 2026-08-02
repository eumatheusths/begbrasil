package br.com.begbrasil.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BegBrasilApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BegBrasilApiApplication.class, args);
    }

}
