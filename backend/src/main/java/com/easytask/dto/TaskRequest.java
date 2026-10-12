package com.easytask.dto;

import com.easytask.entity.TaskPriority;
import com.easytask.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class TaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category = "General";

    private TaskPriority priority = TaskPriority.MEDIUM;

    private TaskStatus status = TaskStatus.PENDING;

    private LocalDateTime startDateTime;

    private LocalDateTime dueDateTime;

    private LocalDateTime reminderDateTime;

    private Integer reminderAdvanceMinutes; // e.g. 5, 15, 30, 60 or null

    public TaskRequest() {
    }

    // Getters and Setters

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
}
