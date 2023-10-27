package com.inf5190.chat.auth.repository;

import java.util.concurrent.ExecutionException;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

@Repository
public class UserAccountRepository {
    private static final String COLLECTION_NAME = "userAccounts";
    private final Firestore firestore = FirestoreClient.getFirestore();

    public FirestoreUserAccount getUserAccount(String username) throws InterruptedException, ExecutionException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(username);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            // Convertir le document en FirestoreUserAccount
            FirestoreUserAccount userAccount = document.toObject(FirestoreUserAccount.class);
            return userAccount;
        } else {
            return null;
        }
    }

    public void setUserAccount(FirestoreUserAccount userAccount) throws InterruptedException, ExecutionException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userAccount.getUsername());
        docRef.set(userAccount).get();
    }
}
