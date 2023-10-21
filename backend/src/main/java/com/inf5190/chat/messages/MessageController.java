package com.inf5190.chat.messages;

import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {
    public static final String MESSAGES_PATH = "/messages";

    private MessageRepository messageRepository;
    private WebSocketManager webSocketManager;

    public MessageController(MessageRepository messageRepository,
            WebSocketManager webSocketManager,
            SessionDataAccessor sessionDataAccessor) {
        this.messageRepository = messageRepository;
        this.webSocketManager = webSocketManager;
    }

        
    @GetMapping(MESSAGES_PATH)
    public ResponseEntity<?> getMessages() {
        return ResponseEntity.ok(messageRepository.getMessages(null));
    }

    @PostMapping(MESSAGES_PATH)
    public ResponseEntity<?> createMessage(@RequestBody Message message) {
        Message newMessage = messageRepository.createMessage(message);
        // Notifie toutes les sessions websocket actives après la publication d'un message
        webSocketManager.notifySessions();
        return ResponseEntity.ok(newMessage);
    }
}
