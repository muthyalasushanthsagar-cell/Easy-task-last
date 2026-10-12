package com.easytask.dto;

import com.easytask.entity.Task;
import com.easytask.entity.TaskPriority;
import com.easytask.entity.TaskStatus;
import java.time.LocalDateTime;

public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDateTime startDateTime;
    private LocalDateTime dueDateTime;
    private LocalDateTime reminderDateTime;
    private Integer reminderAdvanceMinutes;
    private boolean reminderSent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private boolean overdue;

    public TaskResponse() {
    }

    public static TaskResponse fromEntity(Task task) {
        if (task == null) return null;
        TaskResponse res = new TaskResponse();
        res.setId(task.getId());
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setCategory(task.getCategory());
        res.setPriority(task.getPriority());
        res.setStatus(task.getStatus());
        res.setStartDateTime(task.getStartDateTime());
        res.setDueDateTime(task.getDueDateTime());
        res.setReminderDateTime(task.getReminderDateTime());
        res.setReminderAdvanceMinutes(task.getReminderAdvanceMinutes());
        res.setReminderSent(task.isReminderSent());
        res.setCreatedAt(task.getCreatedAt());
        res.setUpdatedAt(task.getUpdatedAt());
        res.setCompletedAt(task.getCompletedAt());
        res.setOverdue(task.isOverdue());
        return res;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getDueDateTime() {
        return dueDateTime;
    }

    public void setDueDateTime(LocalDateTime dueDateTime) {
        this.dueDateTime = dueDateTime;
    }

    public LocalDateTime getReminderDateTime() {
        return reminderDateTime;
    }

    public void setReminderDateTime(LocalDateTime reminderDateTime) {
        this.reminderDateTime = reminderDateTime;
    }

    public Integer getReminderAdvanceMinutes() {
        return reminderAdvanceMinutes;
    }

    public void setReminderAdvanceMinutes(Integer reminderAdvanceMinutes) {
        this.reminderAdvanceMinutes = reminderAdvanceMinutes;
    }

    public boolean isReminderSent() {
        return reminderSent;
    }

    public void setReminderSent(boolean reminderSent) {
        this.reminderSent = reminderSent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public boolean isOverdue() {
        return overdue;
    }

    public void setOverdue(boolean overdue) {
        this.overdue = overdue;
    }
}
