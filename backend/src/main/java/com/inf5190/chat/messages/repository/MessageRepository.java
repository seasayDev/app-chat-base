// MessageRepository.java
package com.inf5190.chat.messages.repository;

import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.Timestamp;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.auth.oauth2.GoogleCredentials;

import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest; 
import com.inf5190.chat.messages.model.ChatImageData; 
import org.springframework.stereotype.Repository;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;
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
                        doc.getString("text"),
                        doc.getString("imageUrl")
                    );
                })
                .collect(Collectors.toList());

            return messages;
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null; 
        }
    }

    public Message createMessage(NewMessageRequest newMessageRequest) throws InterruptedException, ExecutionException {
        FirestoreMessage firestoreMessage = new FirestoreMessage(newMessageRequest.username(), Timestamp.now(), newMessageRequest.text(), null);
        CollectionReference messagesRef = firestore.collection("messages");
        DocumentReference docRef = messagesRef.add(firestoreMessage).get();
        String id = docRef.getId();

        String imageUrl = null;
        if (newMessageRequest.imageData() != null) {
            imageUrl = uploadImageToCloudStorage(newMessageRequest.imageData(), id);
            // Mettez à jour le document avec l'URL de l'image
            docRef.update("imageUrl", imageUrl);
        }

        DocumentSnapshot documentSnapshot = docRef.get().get();
        Timestamp timestamp = documentSnapshot.getUpdateTime();
        Message newMessage = new Message(id, newMessageRequest.username(), timestamp.toDate().getTime(), newMessageRequest.text(), imageUrl);
        return newMessage;
    }

    private String uploadImageToCloudStorage(ChatImageData imageData, String id) {
        // Initialisez votre Cloud Storage
        Storage storage = null;
        try {
            storage = StorageOptions.newBuilder()
              .setCredentials(GoogleCredentials.fromStream(new FileInputStream("firebase-key.json")))
              .build()
              .getService();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Préparez l'image pour l'upload
        byte[] imageBytes = Base64.getDecoder().decode(imageData.data());
        BlobId blobId = BlobId.of("inf5190-chat-72110.appspot.com", id);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(imageData.type()).build();

        // Upload l'image vers Cloud Storage
        storage.create(blobInfo, imageBytes);

        // Générez l'URL de l'image
        return String.format("https://storage.googleapis.com/%s/%s", blobId.getBucket(), blobId.getName());
    }
}
