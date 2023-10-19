package com.inf5190.chat.auth;

import javax.servlet.http.Cookie;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;

/**
 * Contrôleur qui gère l'API de login et logout.
 */
@RestController()
public class AuthController {
    public static final String AUTH_LOGIN_PATH = "/auth/login";
    public static final String AUTH_LOGOUT_PATH = "/auth/logout";
    public static final String SESSION_ID_COOKIE_NAME = "sid";

    private final SessionManager sessionManager;

    public AuthController(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @PostMapping(AUTH_LOGIN_PATH)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // Créer un nouvel objet de type SessionData qui représente la session de l'usager
        SessionData sessionData = new SessionData(loginRequest.username());

        // Ajouter cet objet dans le SessionManager en utilisant la méthode addSession
        String sessionId = this.sessionManager.addSession(sessionData);

        // Créer un cookie HTTP nommé 'sid' qui contient l'identifiant de session
        ResponseCookie cookie = ResponseCookie.from(SESSION_ID_COOKIE_NAME, sessionId)
            .httpOnly(true) // Le cookie ne peut pas être accédé par du code côté client
            .secure(true) // Le cookie ne peut être envoyé que sur une connexion sécurisée
            .path("/") // Le cookie est valable pour tout le domaine
            .maxAge(24 * 60 * 60) // Le cookie expire après 24 heures
            .build();

        // Créer un objet de type LoginResponse qui contient le nom de l'utilisateur
        LoginResponse loginResponse = new LoginResponse(loginRequest.username());

        // Construire la réponse avec le cookie et le corps
        return ResponseEntity.ok() // Le code de statut HTTP est 200 (OK)
            .header(HttpHeaders.SET_COOKIE, cookie.toString()) // Ajouter le cookie dans l'en-tête de la réponse
            .body(loginResponse); // Ajouter le corps de la réponse
    }

    @PostMapping(AUTH_LOGOUT_PATH)
    public ResponseEntity<Void> logout(@CookieValue("sid") Cookie sessionCookie) {
        String sessionId = sessionCookie.getValue();
        this.sessionManager.removeSession(sessionId);

        ResponseCookie cookie = ResponseCookie.from(SESSION_ID_COOKIE_NAME, "")
            .httpOnly(true) // Le cookie ne peut pas être accédé par du code côté client
            .secure(true) // Le cookie ne peut être envoyé que sur une connexion sécurisée
            .path("/") // Le cookie est valable pour tout le domaine
            .maxAge(0) // Expire immédiatement
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .build();
    }
}
