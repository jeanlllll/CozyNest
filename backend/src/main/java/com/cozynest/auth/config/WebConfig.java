package com.cozynest.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())  // Disabling CSRF, only for testing, delete later
                .authorizeHttpRequests((requests) -> requests
                .requestMatchers("v3/api-docs/**", "/swagger-ui.html", "swagger-ui/**").permitAll()
                .requestMatchers("/auth/register").permitAll());
        return http.build();
    }
}
