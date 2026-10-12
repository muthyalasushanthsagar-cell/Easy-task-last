package com.easytask;

import com.easytask.dto.DashboardSummaryResponse;
import com.easytask.dto.TaskRequest;
import com.easytask.dto.TaskResponse;
import com.easytask.entity.TaskPriority;
import com.easytask.entity.TaskStatus;
import com.easytask.service.TaskService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("h2")
class EasyTaskApplicationTests {

    @Autowired
    private TaskService taskService;

    @Test
    @DisplayName("Context Loads & Spring Boot starts cleanly")
    void contextLoads() {
        assertNotNull(taskService);
    }

    @Test
    @DisplayName("Create, retrieve, complete, and delete task lifecycle test")
    void testTaskLifecycle() {
        TaskRequest req = new TaskRequest();
        req.setTitle("Unit Test Task");
        req.setDescription("Testing task lifecycle in Spring Boot");
        req.setCategory("Testing");
        req.setPriority(TaskPriority.HIGH);
        req.setStartDateTime(LocalDateTime.now().plusHours(1));
        req.setDueDateTime(LocalDateTime.now().plusHours(3));
        req.setReminderAdvanceMinutes(15);

        // 1. Create
        TaskResponse created = taskService.createTask(req);
        assertNotNull(created.getId());
        assertEquals("Unit Test Task", created.getTitle());
        assertEquals(TaskPriority.HIGH, created.getPriority());
        assertEquals(TaskStatus.PENDING, created.getStatus());
        assertNotNull(created.getReminderDateTime());

        // 2. Complete
        TaskResponse completed = taskService.completeTask(created.getId());
        assertEquals(TaskStatus.COMPLETED, completed.getStatus());
        assertNotNull(completed.getCompletedAt());

        // 3. Reopen
        TaskResponse reopened = taskService.reopenTask(created.getId());
        assertEquals(TaskStatus.PENDING, reopened.getStatus());
        assertNull(reopened.getCompletedAt());

        // 4. Dashboard Summary reflects tasks
        DashboardSummaryResponse summary = taskService.getDashboardSummary();
        assertTrue(summary.getTotalTasks() >= 1);

        // 5. Delete
        taskService.deleteTask(created.getId());
        List<TaskResponse> all = taskService.getAllTasks(null, null, null, "Unit Test Task", null, null);
        assertTrue(all.isEmpty());
    }
}
