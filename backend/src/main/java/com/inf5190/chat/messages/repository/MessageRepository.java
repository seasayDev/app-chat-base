package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import com.inf5190.chat.messages.model.Message;

import org.springframework.stereotype.Repository;

/**
 * Classe qui gère la persistence des messages.
 * 
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {
    private final List<Message> messages = new ArrayList<Message>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public List<Message> getMessages(Long fromId) {
        List<Message> messages = this.messages.stream().sorted(Comparator.comparingLong((m) -> m.timestamp())).toList();
        if (fromId == null) {
            return messages;
        }

        return messages.stream().dropWhile((m) -> m.id() != fromId).skip(1).toList();
    }

    public Message createMessage(Message message) {
        Message newMessage = new Message(this.idGenerator.incrementAndGet(), message.username(),
                System.currentTimeMillis(),
                message.text());

        this.messages.add(newMessage);
        return newMessage;
    }

}
