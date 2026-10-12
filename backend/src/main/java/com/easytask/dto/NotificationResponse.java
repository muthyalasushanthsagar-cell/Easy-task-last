package com.easytask.dto;

import com.easytask.entity.Notification;
import com.easytask.entity.NotificationType;
import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private Long taskId;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse() {
    }

    public static NotificationResponse fromEntity(Notification notification) {
        if (notification == null) return null;
        NotificationResponse res = new NotificationResponse();
        res.setId(notification.getId());
        res.setTaskId(notification.getTaskId());
        res.setTitle(notification.getTitle());
        res.setMessage(notification.getMessage());
        res.setType(notification.getType());
        res.setRead(notification.isRead());
        res.setCreatedAt(notification.getCreatedAt());
        return res;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
