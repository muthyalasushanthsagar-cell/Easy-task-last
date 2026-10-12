package com.easytask.service;

import com.easytask.dto.DashboardSummaryResponse;
import com.easytask.dto.TaskRequest;
import com.easytask.dto.TaskResponse;
import com.easytask.entity.Task;
import com.easytask.entity.TaskPriority;
import com.easytask.entity.TaskStatus;
import com.easytask.exception.BadRequestException;
import com.easytask.exception.ResourceNotFoundException;
import com.easytask.repository.NotificationRepository;
import com.easytask.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;

    public TaskService(TaskRepository taskRepository, NotificationRepository notificationRepository) {
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
    }

    public TaskResponse createTask(TaskRequest request) {
        validateTaskDates(request.getStartDateTime(), request.getDueDateTime());

        Task task = new Task();
        copyProperties(request, task);
        calculateReminder(request, task);

        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        validateTaskDates(request.getStartDateTime(), request.getDueDateTime());

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        copyProperties(request, task);
        calculateReminder(request, task);

        // If task is completed, mark completedAt
        if (task.getStatus() == TaskStatus.COMPLETED && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        } else if (task.getStatus() != TaskStatus.COMPLETED) {
            task.setCompletedAt(null);
        }

        Task updated = taskRepository.save(task);
        return TaskResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return TaskResponse.fromEntity(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(String status, String priority, String category, String search, String sortBy, String sortDir) {
        TaskStatus statusEnum = null;
        if (status != null && !status.equalsIgnoreCase("ALL") && !status.isBlank()) {
            try {
                statusEnum = TaskStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        TaskPriority priorityEnum = null;
        if (priority != null && !priority.equalsIgnoreCase("ALL") && !priority.isBlank()) {
            try {
                priorityEnum = TaskPriority.valueOf(priority.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        String catFilter = (category != null && !category.equalsIgnoreCase("ALL") && !category.isBlank()) ? category : null;
        String searchTerm = (search != null && !search.isBlank()) ? search.trim() : null;

        List<Task> tasks = taskRepository.filterTasks(statusEnum, priorityEnum, catFilter, searchTerm);

        // Sorting
        Comparator<Task> comparator;
        if ("priority".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(Task::getPriority);
        } else if ("dueDateTime".equalsIgnoreCase(sortBy) || "dueDate".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(Task::getDueDateTime, Comparator.nullsLast(Comparator.naturalOrder()));
        } else {
            // Default: createdAt descending
            comparator = Comparator.comparing(Task::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));
        }

        if ("asc".equalsIgnoreCase(sortDir)) {
            tasks.sort(comparator);
        } else if ("priority".equalsIgnoreCase(sortBy) || "dueDateTime".equalsIgnoreCase(sortBy) || "dueDate".equalsIgnoreCase(sortBy)) {
            tasks.sort(comparator);
        } else {
            tasks.sort(comparator.reversed());
        }

        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    public TaskResponse completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        Task updated = taskRepository.save(task);
        return TaskResponse.fromEntity(updated);
    }

    public TaskResponse reopenTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setStatus(TaskStatus.PENDING);
        task.setCompletedAt(null);
        Task updated = taskRepository.save(task);
        return TaskResponse.fromEntity(updated);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        notificationRepository.deleteByTaskId(id);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTodayTasks() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Task> tasks = taskRepository.findByDueDateTimeBetween(startOfDay, endOfDay);
        tasks.sort(Comparator.comparing(Task::getDueDateTime, Comparator.nullsLast(Comparator.naturalOrder())));
        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getUpcomingTasks() {
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);
        List<Task> tasks = taskRepository.findByDueDateTimeAfterAndStatusNot(endOfToday, TaskStatus.COMPLETED);
        tasks.sort(Comparator.comparing(Task::getDueDateTime, Comparator.nullsLast(Comparator.naturalOrder())));
        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getCompletedTasks() {
        List<Task> tasks = taskRepository.findByStatus(TaskStatus.COMPLETED);
        tasks.sort(Comparator.comparing(Task::getCompletedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks() {
        LocalDateTime now = LocalDateTime.now();
        List<Task> tasks = taskRepository.findByDueDateTimeBeforeAndStatusNot(now, TaskStatus.COMPLETED);
        tasks.sort(Comparator.comparing(Task::getDueDateTime, Comparator.nullsLast(Comparator.naturalOrder())));
        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        List<Task> all = taskRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        long total = all.size();
        long completed = all.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count();
        long inProgress = all.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long pending = all.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).count();

        long overdue = all.stream().filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getDueDateTime() != null && t.getDueDateTime().isBefore(now)).count();
        long highPriority = all.stream().filter(t -> t.getPriority() == TaskPriority.HIGH && t.getStatus() != TaskStatus.COMPLETED).count();

        List<Task> today = all.stream()
                .filter(t -> t.getDueDateTime() != null && !t.getDueDateTime().isBefore(startOfDay) && !t.getDueDateTime().isAfter(endOfDay))
                .sorted(Comparator.comparing(Task::getDueDateTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());

        List<Task> upcoming = all.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getDueDateTime() != null && t.getDueDateTime().isAfter(endOfDay))
                .sorted(Comparator.comparing(Task::getDueDateTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(5)
                .collect(Collectors.toList());

        List<Task> overdueList = all.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getDueDateTime() != null && t.getDueDateTime().isBefore(now))
                .sorted(Comparator.comparing(Task::getDueDateTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(5)
                .collect(Collectors.toList());

        List<Task> recent = all.stream()
                .sorted(Comparator.comparing(Task::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());

        double completionRate = total > 0 ? Math.round(((double) completed / total) * 1000.0) / 10.0 : 0.0;

        DashboardSummaryResponse res = new DashboardSummaryResponse();
        res.setTotalTasks(total);
        res.setPendingTasks(pending);
        res.setInProgressTasks(inProgress);
        res.setCompletedTasks(completed);
        res.setOverdueTasks(overdue);
        res.setTodayTasks(today.size());
        res.setUpcomingTasks(upcoming.size());
        res.setHighPriorityTasks(highPriority);
        res.setCompletionRate(completionRate);

        res.setTodayTasksList(today.stream().map(TaskResponse::fromEntity).collect(Collectors.toList()));
        res.setUpcomingTasksList(upcoming.stream().map(TaskResponse::fromEntity).collect(Collectors.toList()));
        res.setOverdueTasksList(overdueList.stream().map(TaskResponse::fromEntity).collect(Collectors.toList()));
        res.setRecentTasksList(recent.stream().map(TaskResponse::fromEntity).collect(Collectors.toList()));

        return res;
    }

    private void validateTaskDates(LocalDateTime start, LocalDateTime due) {
        if (start != null && due != null && due.isBefore(start)) {
            throw new BadRequestException("Due date and time must not be earlier than start date and time.");
        }
    }

    private void copyProperties(TaskRequest req, Task task) {
        task.setTitle(req.getTitle().trim());
        task.setDescription(req.getDescription() != null ? req.getDescription().trim() : null);
        task.setCategory(req.getCategory() != null && !req.getCategory().isBlank() ? req.getCategory().trim() : "General");
        task.setPriority(req.getPriority() != null ? req.getPriority() : TaskPriority.MEDIUM);
        if (req.getStatus() != null) {
            task.setStatus(req.getStatus());
        }
        task.setStartDateTime(req.getStartDateTime());
        task.setDueDateTime(req.getDueDateTime());
        task.setReminderAdvanceMinutes(req.getReminderAdvanceMinutes());
    }

    private void calculateReminder(TaskRequest req, Task task) {
        if (req.getReminderAdvanceMinutes() != null && req.getReminderAdvanceMinutes() > 0 && req.getDueDateTime() != null) {
            LocalDateTime calculatedReminder = req.getDueDateTime().minusMinutes(req.getReminderAdvanceMinutes());
            task.setReminderDateTime(calculatedReminder);
            task.setReminderSent(false);
        } else if (req.getReminderDateTime() != null) {
            task.setReminderDateTime(req.getReminderDateTime());
            task.setReminderSent(false);
        } else if (req.getReminderAdvanceMinutes() == null && req.getReminderDateTime() == null) {
            task.setReminderDateTime(null);
            task.setReminderSent(false);
        }
    }
}
