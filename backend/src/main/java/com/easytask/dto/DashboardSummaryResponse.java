package com.easytask.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryResponse {

    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long overdueTasks;
    private long todayTasks;
    private long upcomingTasks;
    private long highPriorityTasks;
    private double completionRate;

    private List<TaskResponse> todayTasksList = new ArrayList<>();
    private List<TaskResponse> upcomingTasksList = new ArrayList<>();
    private List<TaskResponse> overdueTasksList = new ArrayList<>();
    private List<TaskResponse> recentTasksList = new ArrayList<>();

    public DashboardSummaryResponse() {
    }

    // Getters and Setters

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public long getTodayTasks() {
        return todayTasks;
    }

    public void setTodayTasks(long todayTasks) {
        this.todayTasks = todayTasks;
    }

    public long getUpcomingTasks() {
        return upcomingTasks;
    }

    public void setUpcomingTasks(long upcomingTasks) {
        this.upcomingTasks = upcomingTasks;
    }

    public long getHighPriorityTasks() {
        return highPriorityTasks;
    }

    public void setHighPriorityTasks(long highPriorityTasks) {
        this.highPriorityTasks = highPriorityTasks;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public List<TaskResponse> getTodayTasksList() {
        return todayTasksList;
    }

    public void setTodayTasksList(List<TaskResponse> todayTasksList) {
        this.todayTasksList = todayTasksList;
    }

    public List<TaskResponse> getUpcomingTasksList() {
        return upcomingTasksList;
    }

    public void setUpcomingTasksList(List<TaskResponse> upcomingTasksList) {
        this.upcomingTasksList = upcomingTasksList;
    }

    public List<TaskResponse> getOverdueTasksList() {
        return overdueTasksList;
    }

    public void setOverdueTasksList(List<TaskResponse> overdueTasksList) {
        this.overdueTasksList = overdueTasksList;
    }

    public List<TaskResponse> getRecentTasksList() {
        return recentTasksList;
    }

    public void setRecentTasksList(List<TaskResponse> recentTasksList) {
        this.recentTasksList = recentTasksList;
    }
}
