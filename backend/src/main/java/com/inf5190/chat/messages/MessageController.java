package com.inf5190.chat.messages;

import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contrôleur qui gère l'API de messages.
 */
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
    public List<Message> getMessages(@RequestParam Optional<String> fromId) {
        return this.messageRepository.getMessages(fromId.orElse(null));
    }

    @PostMapping(MESSAGES_PATH)
    public Message createMessage(@RequestBody Message message) {
        Message newMessage = this.messageRepository.createMessage(message);

        this.webSocketManager.notifySessions();

        return newMessage;
    }
}
