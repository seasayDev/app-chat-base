package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import com.inf5190.chat.messages.model.Message;

import org.springframework.stereotype.Repository;

@Repository
public class MessageRepository {
    private final List<Message> messages = new ArrayList<Message>();
    private final AtomicLong idGenerator = new AtomicLong(0);

   public List<Message> getMessages(Long fromId) {
    // Ignorer le paramètre fromId pour le moment
    return new ArrayList<>(messages);
}

public Message createMessage(Message message) {
    // Générer un nouvel ID pour le message
    long id = idGenerator.incrementAndGet();

    // Créer un nouveau message avec l'ID généré
    Message newMessage = new Message(id, message.username(), message.timestamp(), message.text());

    // Ajouter le message à la liste
    messages.add(newMessage);

    return newMessage;
}

}
