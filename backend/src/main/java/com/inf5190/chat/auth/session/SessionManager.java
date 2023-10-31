package com.inf5190.chat.auth.session;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;

import org.springframework.stereotype.Repository;

/**
 * Classe qui gère les sessions utilisateur.
 */
@Repository
public class SessionManager {

    private final Map<String, SessionData> sessions = new HashMap<String, SessionData>();
    private static final String SECRET_KEY_BASE64 = "Xzg7nu3URqTLiv+sfKwV/aP3VAaAi2136Xx2OI2c++8=";
    private final SecretKey secretKey;
    private final JwtParser jwtParser;

    public SessionManager() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_BASE64));
        this.jwtParser = Jwts.parser().setSigningKey(this.secretKey).build();
    }

    public String addSession(SessionData authData) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 heures après la création
        String jwt = Jwts.builder()
                .setAudience("chat-app") // l'audience du jeton
                .setIssuedAt(now) // la date de création du jeton
                .setSubject(authData.username()) // le nom d'utilisateur comme sujet du jeton
                .setExpiration(expiry) // la date d'expiration du jeton
                .signWith(this.secretKey) // signer le jeton avec la clé secrète
                .compact(); // retourner le jeton en version compacte
        this.sessions.put(jwt, authData);
        return jwt;
    }

    public void removeSession(String sessionId) {
        this.sessions.remove(sessionId);
    }

    public SessionData getSession(String sessionId) {
        try {
            Claims claims = this.jwtParser.parseClaimsJws(sessionId).getBody();
            String username = claims.getSubject();
            return new SessionData(username);
        } catch (JwtException e) {
            return null;
        }
    }
}
