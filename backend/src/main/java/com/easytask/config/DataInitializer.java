package com.easytask.config;

import com.easytask.entity.*;
import com.easytask.repository.GroceryListRepository;
import com.easytask.repository.NotificationRepository;
import com.easytask.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final TaskRepository taskRepository;
    private final GroceryListRepository groceryListRepository;
    private final NotificationRepository notificationRepository;

    public DataInitializer(TaskRepository taskRepository,
                           GroceryListRepository groceryListRepository,
                           NotificationRepository notificationRepository) {
        this.taskRepository = taskRepository;
        this.groceryListRepository = groceryListRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) {
        if (taskRepository.count() == 0) {
            log.info("Seeding initial starter tasks for Easy Task...");
            seedTasks();
        }

        if (groceryListRepository.count() == 0) {
            log.info("Seeding initial grocery and shopping checklists...");
            seedGroceryLists();
        }
    }

    private void seedTasks() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Today task (High priority)
        Task t1 = new Task();
        t1.setTitle("Review Q3 Project Deliverables");
        t1.setDescription("Check the sprint backlog, pull request reviews, and prepare the demo checklist for the team meeting.");
        t1.setCategory("Work");
        t1.setPriority(TaskPriority.HIGH);
        t1.setStatus(TaskStatus.IN_PROGRESS);
        t1.setStartDateTime(now.withHour(9).withMinute(0));
        t1.setDueDateTime(now.withHour(18).withMinute(0));
        t1.setReminderAdvanceMinutes(30);
        t1.setReminderDateTime(now.withHour(17).withMinute(30));
        taskRepository.save(t1);

        // 2. Today task (Medium priority)
        Task t2 = new Task();
        t2.setTitle("Submit Cloud Architecture Assignment");
        t2.setDescription("Complete section 4 diagrams and convert the PDF report before submitting on the student portal.");
        t2.setCategory("Study");
        t2.setPriority(TaskPriority.MEDIUM);
        t2.setStatus(TaskStatus.PENDING);
        t2.setStartDateTime(now.withHour(14).withMinute(0));
        t2.setDueDateTime(now.withHour(20).withMinute(30));
        t2.setReminderAdvanceMinutes(15);
        t2.setReminderDateTime(now.withHour(20).withMinute(15));
        taskRepository.save(t2);

        // 3. Upcoming task
        Task t3 = new Task();
        t3.setTitle("Schedule Dentist Checkup");
        t3.setDescription("Call Dr. Sharma's clinic to book routine dental cleaning and checkup appointment.");
        t3.setCategory("Health");
        t3.setPriority(TaskPriority.LOW);
        t3.setStatus(TaskStatus.PENDING);
        t3.setDueDateTime(now.plusDays(2).withHour(11).withMinute(0));
        t3.setReminderAdvanceMinutes(60);
        t3.setReminderDateTime(now.plusDays(2).withHour(10).withMinute(0));
        taskRepository.save(t3);

        // 4. Completed task
        Task t4 = new Task();
        t4.setTitle("Renew Home Broadband Plan");
        t4.setDescription("Paid annual high-speed fiber internet subscription and updated payment method.");
        t4.setCategory("Personal");
        t4.setPriority(TaskPriority.MEDIUM);
        t4.setStatus(TaskStatus.COMPLETED);
        t4.setDueDateTime(now.minusDays(1).withHour(15).withMinute(0));
        t4.setCompletedAt(now.minusDays(1).withHour(14).withMinute(20));
        taskRepository.save(t4);

        // 5. Overdue task for demo
        Task t5 = new Task();
        t5.setTitle("File Monthly Expense Receipts");
        t5.setDescription("Collect taxi and office utility bills and submit them for reimbursement.");
        t5.setCategory("Finance");
        t5.setPriority(TaskPriority.HIGH);
        t5.setStatus(TaskStatus.PENDING);
        t5.setDueDateTime(now.minusHours(4));
        taskRepository.save(t5);

        log.info("Initialized sample tasks successfully.");
    }

    private void seedGroceryLists() {
        // List 1: Weekly Groceries
        GroceryList l1 = new GroceryList("Weekly Groceries", "Supermarket essentials for cooking and meal prep", "#4f46e5");
        l1.addItem(new GroceryItem("Organic Whole Milk", "2 Liters", "Dairy"));
        l1.addItem(new GroceryItem("Brown Basmati Rice", "5 kg", "Grains"));
        l1.addItem(new GroceryItem("Fresh Spinach & Tomatoes", "1 kg each", "Produce"));
        l1.addItem(new GroceryItem("Cold Pressed Olive Oil", "1 Bottle", "Pantry"));
        l1.addItem(new GroceryItem("Whole Wheat Bread", "1 Loaf", "Bakery"));
        groceryListRepository.save(l1);

        // Mark first item as purchased
        if (!l1.getItems().isEmpty()) {
            l1.getItems().get(0).setPurchased(true);
            groceryListRepository.save(l1);
        }

        // List 2: Household & Cleaning
        GroceryList l2 = new GroceryList("Household Supplies", "Cleaning detergents and utility items", "#0891b2");
        l2.addItem(new GroceryItem("Laundry Detergent Liquid", "2 L", "Cleaning"));
        l2.addItem(new GroceryItem("Dishwashing Gel", "750 ml", "Kitchen"));
        l2.addItem(new GroceryItem("Microfiber Cleaning Cloths", "Pack of 4", "Cleaning"));
        l2.addItem(new GroceryItem("Garbage Bags (Medium)", "30 rolls", "Utility"));
        groceryListRepository.save(l2);

        // Initial welcome notification
        Notification welcome = new Notification(
                null,
                "Welcome to Easy Task!",
                "Manage your work, daily routines, advance reminders, and shopping checklists effortlessly.",
                NotificationType.SYSTEM
        );
        notificationRepository.save(welcome);

        log.info("Initialized sample grocery checklists successfully.");
    }
}
