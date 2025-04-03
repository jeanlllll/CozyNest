package com.cozynest.auth.config;

import com.cozynest.controllers.OrderController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CsrfFilter;


import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableScheduling
@EnableAsync
public class WebConfig {

    @Autowired
    private CorsConfig corsConfig;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private StatelessCSRFFilter statelessCSRFFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .csrf((csrf) -> csrf.disable())
                .addFilterBefore(statelessCSRFFilter, CsrfFilter.class)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) //disable sessions
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/home/**").permitAll()
                        .requestMatchers("/api/csrf/**").permitAll()
                        .requestMatchers("/api/payment/**").hasAuthority("CLIENT")
                        .requestMatchers("/api/product/**").permitAll()
                        .requestMatchers("/api/discountCode/**").permitAll()
                        .requestMatchers("/api/oauth2/google/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "swagger-ui/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/subscription/**").permitAll()
                        .requestMatchers("/webhook/**").permitAll()
                        .requestMatchers("/api/favorites/**").hasAuthority("CLIENT")
                        .requestMatchers("/api/cart/**").hasAuthority("CLIENT")
                        .requestMatchers("/api/client/**").hasAuthority("CLIENT")
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
