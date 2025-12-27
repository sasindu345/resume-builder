package com.sasindu.rdsumebuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * ============================================================================
 * MAIN APPLICATION CLASS
 * ============================================================================
 * Entry point for the Spring Boot application
 *
 * @SpringBootApplication - Combines 3 annotations:
 *   - @Configuration: Makes this a configuration class
 *   - @EnableAutoConfiguration: Auto-configures Spring based on dependencies
 *   - @ComponentScan: Scans for Spring components in this package and sub-packages
 *
 * @EnableAsync - Enables asynchronous method execution
 *   - Required for @Async annotation to work
 *   - Email sending runs in separate threads (non-blocking)
 *   - Improves performance - API doesn't wait for email to send
 * ============================================================================
 */
@SpringBootApplication
@EnableAsync  // Enable async email sending
public class RdsumebuilderApplication {

	public static void main(String[] args) {
		SpringApplication.run(RdsumebuilderApplication.class, args);
	}

}
