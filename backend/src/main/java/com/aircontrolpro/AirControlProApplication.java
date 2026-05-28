package com.aircontrolpro;

import com.aircontrolpro.repository.UserRepository;
import com.aircontrolpro.users.Administrador;
import com.aircontrolpro.users.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class AirControlProApplication {

	public static void main(String[] args) {
		SpringApplication.run(AirControlProApplication.class, args);
	}

	@Bean
	public CommandLineRunner setupAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			userRepository.findByUsername("admin").ifPresentOrElse(
				admin -> {
					String newPassword = passwordEncoder.encode("admin123");
					admin.setPassword(newPassword);
					userRepository.save(admin);
					System.out.println(">>> Contraseña de 'admin' RE-ACTUALIZADA a 'admin123'");
				},
				() -> {
					Administrador admin = new Administrador();
					admin.setUsername("admin");
					admin.setPassword(passwordEncoder.encode("admin123"));
					admin.setEmail("admin@aircontrolpro.com");
					admin.setRole(UserRole.ADMIN);
					admin.setEnabled(true);
					userRepository.save(admin);
					System.out.println(">>> Usuario 'admin' CREADO con contraseña 'admin123'");
				}
			);
		};
	}

}
