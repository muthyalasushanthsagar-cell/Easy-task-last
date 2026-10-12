package com.easytask.service;

import com.easytask.entity.Notification;
import com.easytask.entity.NotificationType;
import com.easytask.entity.Task;
import com.easytask.entity.TaskStatus;
import com.easytask.repository.NotificationRepository;
import com.easytask.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReminderSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(ReminderSchedulerService.class);
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");

    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;

    public ReminderSchedulerService(TaskRepository taskRepository, NotificationRepository notificationRepository) {
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
    }

    @Scheduled(fixedRate = 30000, initialDelay = 5000)
    @Transactional
    public void processReminders() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Process advance reminders
        List<Task> pendingReminders = taskRepository.findByReminderDateTimeLessThanEqualAndReminderSentFalseAndStatusNot(
                now, TaskStatus.COMPLETED
        );

        for (Task task : pendingReminders) {
            String dueStr = task.getDueDateTime() != null ? task.getDueDateTime().format(TIME_FMT) : "Soon";
            String title = "Upcoming Task: " + task.getTitle();
            String message = String.format("Task '%s' is scheduled for %s [%s Priority].",
                    task.getTitle(), dueStr, task.getPriority());

            Notification notification = new Notification(task.getId(), title, message, NotificationType.REMINDER);
            notificationRepository.save(notification);

            task.setReminderSent(true);
            taskRepository.save(task);

            log.info("Sent reminder notification for task id: {}, title: '{}'", task.getId(), task.getTitle());
        }

        // 2. Process newly overdue tasks (send only once per task)
        List<Task> overdueTasks = taskRepository.findByDueDateTimeBeforeAndStatusNot(now, TaskStatus.COMPLETED);
        for (Task task : overdueTasks) {
            String overdueTitle = "Task Overdue: " + task.getTitle();
            boolean alreadyNotified = notificationRepository.existsByTaskIdAndTitle(task.getId(), overdueTitle);
            if (!alreadyNotified) {
                String dueStr = task.getDueDateTime() != null ? task.getDueDateTime().format(TIME_FMT) : "Now";
                String message = String.format("The deadline for task '%s' passed on %s.", task.getTitle(), dueStr);

                Notification notification = new Notification(task.getId(), overdueTitle, message, NotificationType.OVERDUE);
                notificationRepository.save(notification);
                log.info("Sent overdue notification for task id: {}, title: '{}'", task.getId(), task.getTitle());
            }
        }
    }
}
