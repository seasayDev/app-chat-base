package com.inf5190.chat.messages.repository;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.DocumentId;

import java.util.Objects;

public class FirestoreMessage {
    @DocumentId
    private String id;

    private String username;
    private Timestamp timestamp;
    private String text;
    private String imageUrl;

    public FirestoreMessage() {
    }

    public FirestoreMessage(String username, Timestamp timestamp, String text, String imageUrl) {
        this.username = username;
        this.timestamp = timestamp;
        this.text = text;
        this.imageUrl = imageUrl;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        FirestoreMessage that = (FirestoreMessage) o;
        return Objects.equals(id, that.id) && Objects.equals(username, that.username)
                && Objects.equals(timestamp, that.timestamp) && Objects.equals(text, that.text)
                && Objects.equals(imageUrl, that.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, timestamp, text, imageUrl);
    }

    @Override
    public String toString() {
        return "FirestoreMessage{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", timestamp=" + timestamp +
                ", text='" + text + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
