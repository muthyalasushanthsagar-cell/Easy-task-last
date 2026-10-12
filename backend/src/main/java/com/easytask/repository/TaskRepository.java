package com.easytask.repository;

import com.easytask.entity.Task;
import com.easytask.entity.TaskPriority;
import com.easytask.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(TaskPriority priority);

    List<Task> findByDueDateTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Task> findByDueDateTimeBeforeAndStatusNot(LocalDateTime time, TaskStatus status);

    List<Task> findByDueDateTimeAfterAndStatusNot(LocalDateTime time, TaskStatus status);

    List<Task> findByReminderDateTimeLessThanEqualAndReminderSentFalseAndStatusNot(LocalDateTime time, TaskStatus status);

    long countByStatus(TaskStatus status);

    long countByPriority(TaskPriority priority);

    long countByDueDateTimeBeforeAndStatusNot(LocalDateTime time, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR LOWER(t.category) = LOWER(:category)) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Task> filterTasks(@Param("status") TaskStatus status,
                           @Param("priority") TaskPriority priority,
                           @Param("category") String category,
                           @Param("search") String search);
}
