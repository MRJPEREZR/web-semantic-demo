package com.wdws.finalProject.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

    @Override 
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")  // Allow CORS on all endpoints
                .allowedOrigins("http://localhost:3000")  // frontend's URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
