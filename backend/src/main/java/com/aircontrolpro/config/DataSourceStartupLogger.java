package com.aircontrolpro.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class DataSourceStartupLogger {

    private static final Logger log = LoggerFactory.getLogger(DataSourceStartupLogger.class);

    private final Environment environment;

    public DataSourceStartupLogger(Environment environment) {
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logDataSourceInfo() {
        String url = environment.getProperty("spring.datasource.url", "NO CONFIGURADA");
        String user = environment.getProperty("spring.datasource.username", "?");
        String[] profiles = environment.getActiveProfiles();
        String profile = profiles.length > 0 ? String.join(", ", profiles) : "default";

        log.info("=== Conexion BD activa ===");
        log.info("Perfil: {}", profile);
        log.info("URL: {}", url);
        log.info("Usuario: {}", user);
        log.info("==========================");
    }
}
