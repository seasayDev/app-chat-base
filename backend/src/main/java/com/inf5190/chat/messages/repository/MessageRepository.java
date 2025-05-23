package com.inf5190.chat.messages.repository;

import java.util.List;
import java.util.concurrent.ExecutionException;

import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Bucket.BlobTargetOption;
import com.google.cloud.storage.Storage.PredefinedAcl;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;

import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest;

import io.jsonwebtoken.io.Decoders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

@Repository
public class MessageRepository {
    private static final String COLLECTION_NAME = "messages";
    private static final int DEFAULT_LIMIT = 20;

    private final Firestore firestore;
    private final StorageClient storageClient;

    @Autowired
    @Qualifier("storageBucketName")
    private String storageBucketName;

    public MessageRepository(Firestore firestore, StorageClient storageClient) {
        this.firestore = firestore;
        this.storageClient = storageClient;
    }

    public List<Message> getMessages(String fromId) throws InterruptedException, ExecutionException {
        Query messageQuery = this.firestore.collection(COLLECTION_NAME).orderBy("timestamp");

        if (fromId != null) {
            DocumentSnapshot fromIdDocument = this.firestore.collection(COLLECTION_NAME).document(fromId).get().get();
            if (!fromIdDocument.exists()) {
                throw new DocumentNotFoundException("Document with id " + fromId + " not found.");
            }
            messageQuery = messageQuery.startAfter(fromIdDocument);
        } else {
            messageQuery = messageQuery.limitToLast(DEFAULT_LIMIT);
        }

        return messageQuery.get().get().toObjects(FirestoreMessage.class).stream().map(message -> {
            return this.toMessage(message.getId(), message);
        }).toList();
    };

    public Message createMessage(NewMessageRequest message) throws InterruptedException, ExecutionException {
        DocumentReference ref = this.firestore.collection(COLLECTION_NAME).document();

        String imageUrl = null;
        if (message.imageData() != null) {
            Bucket b = this.storageClient.bucket(storageBucketName);
            String path = String.format("images/%s.%s", ref.getId(), message.imageData().type());
            b.create(path, Decoders.BASE64.decode(message.imageData().data()),
                    BlobTargetOption.predefinedAcl(PredefinedAcl.PUBLIC_READ));
            imageUrl = String.format("https://storage.googleapis.com/%s/%s", storageBucketName, path);
        }

        FirestoreMessage firestoreMessage = new FirestoreMessage(
                message.username(),
                Timestamp.now(),
                message.text(),
                imageUrl);

        ref.create(firestoreMessage).get();
        return this.toMessage(ref.getId(), firestoreMessage);
    }

    private Message toMessage(String id, FirestoreMessage firestoreMessage) {
        return new Message(id, firestoreMessage.getUsername(),
                firestoreMessage.getTimestamp().toDate().getTime(), firestoreMessage.getText(),
                firestoreMessage.getImageUrl());
    }
}
