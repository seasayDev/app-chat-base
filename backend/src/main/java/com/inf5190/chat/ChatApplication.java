package com.inf5190.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

import com.inf5190.chat.auth.AuthController;
import com.inf5190.chat.auth.filter.AuthFilter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.FileInputStream;
import java.io.IOException;
import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.auth.session.SessionManager;
import com.inf5190.chat.messages.MessageController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Application spring boot.
 */
@SpringBootApplication
public class ChatApplication {

  private static final Logger LOGGER = LoggerFactory.getLogger(ChatApplication.class);

  public static void main(String[] args) {
    try {
      if (FirebaseApp.getApps().size() == 0) {
        FileInputStream serviceAccount = new
        FileInputStream("firebase-key.json");
        FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(GoogleCredentials.fromStream(serviceAccount))
          .build();
        LOGGER.info("Initializing Firebase application.");
        FirebaseApp.initializeApp(options);
      }
      LOGGER.info("Firebase application already initialized.");
      SpringApplication.run(ChatApplication.class, args);
    } catch (IOException e) {
      System.err.println("Could not initialise application. Please check your service account key path.");
    }
  }

  /**
   * Fonction qui enregistre le filtre d'authorization.
   */
  @Bean
  public FilterRegistrationBean<AuthFilter> authenticationFilter(
    SessionDataAccessor sessionDataAccessor,
    SessionManager sessionManager) {
    FilterRegistrationBean<AuthFilter> registrationBean = new FilterRegistrationBean<>();

    registrationBean.setFilter(new AuthFilter(sessionDataAccessor,
      sessionManager));
    registrationBean.addUrlPatterns(MessageController.MESSAGES_PATH, AuthController.AUTH_LOGOUT_PATH);

    return registrationBean;
  }
}
/**
 * Fonction qui encode le mot de passe  
 */
@Bean
public PasswordEncoder getPasswordEncoder() {
return new BCryptPasswordEncoder();
}
