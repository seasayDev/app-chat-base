package com.inf5190.chat.messages.repository;

import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.Timestamp;

import com.inf5190.chat.messages.model.Message;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class MessageRepository {
    private final Firestore firestore;

    public MessageRepository() {
        this.firestore = FirestoreClient.getFirestore();
    }

    public List<Message> getMessages(String fromId) {
        try {
            Query query = firestore.collection("messages").orderBy("timestamp").limit(20);
            if (fromId != null) {
                DocumentSnapshot lastSnapshot = firestore.collection("messages").document(fromId).get().get();
                query = query.startAfter(lastSnapshot);
            }
            List<QueryDocumentSnapshot> documents = query.get().get().getDocuments();

            List<Message> messages = documents.stream()
                .map(doc -> {
                    Timestamp timestamp = doc.getTimestamp("timestamp");
                    Long timestampMillis = timestamp != null ? timestamp.toDate().getTime() : null;
                    return new Message(
                        doc.getId(),
                        doc.getString("username"),
                        timestampMillis,
                        doc.getString("text")
                    );
                })
                .collect(Collectors.toList());

            return messages;
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null; 
        }
    }

    public Message createMessage(Message message) {
        try {
            FirestoreMessage firestoreMessage = new FirestoreMessage(message.username(), Timestamp.now(), message.text());
            CollectionReference messagesRef = firestore.collection("messages");
            DocumentReference docRef = messagesRef.add(firestoreMessage).get();
            String id = docRef.getId();
            DocumentSnapshot documentSnapshot = docRef.get().get();
            Timestamp timestamp = documentSnapshot.getUpdateTime();
            Message newMessage = new Message(id, message.username(), timestamp.toDate().getTime(), message.text());
            return newMessage;
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null; 
        }
    }
}



