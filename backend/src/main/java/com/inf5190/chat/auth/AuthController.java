package com.inf5190.chat.auth;

import java.util.concurrent.TimeUnit;

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
        String sessionId = this.sessionManager.addSession(new SessionData(loginRequest.username()));

        ResponseCookie sessionCookie = this.createResponseSessionCookie(sessionId, TimeUnit.DAYS.toSeconds(1));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookie.toString())
                .body(new LoginResponse(loginRequest.username()));

    }

    @PostMapping(AUTH_LOGOUT_PATH)
    public ResponseEntity<Void> logout(@CookieValue("sid") Cookie sessionCookie) {
        this.sessionManager.removeSession(sessionCookie.getValue());

        ResponseCookie deleteSessionCookie = this.createResponseSessionCookie(null, 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteSessionCookie.toString()).body(null);

    }

    private ResponseCookie createResponseSessionCookie(String sessiondId, long maxAge) {
        return ResponseCookie.from(SESSION_ID_COOKIE_NAME, sessiondId)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .maxAge(maxAge)
                .build();
    }
}
