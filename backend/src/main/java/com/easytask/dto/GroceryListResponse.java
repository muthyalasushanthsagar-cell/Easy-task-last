package com.easytask.dto;

import com.easytask.entity.GroceryList;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class GroceryListResponse {

    private Long id;
    private String title;
    private String description;
    private String color;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int totalItems;
    private int purchasedItems;
    private List<GroceryItemResponse> items = new ArrayList<>();

    public GroceryListResponse() {
    }

    public static GroceryListResponse fromEntity(GroceryList list) {
        if (list == null) return null;
        GroceryListResponse res = new GroceryListResponse();
        res.setId(list.getId());
        res.setTitle(list.getTitle());
        res.setDescription(list.getDescription());
        res.setColor(list.getColor());
        res.setCreatedAt(list.getCreatedAt());
        res.setUpdatedAt(list.getUpdatedAt());

        if (list.getItems() != null) {
            res.setTotalItems(list.getItems().size());
            res.setPurchasedItems((int) list.getItems().stream().filter(i -> i.isPurchased()).count());
            res.setItems(list.getItems().stream().map(GroceryItemResponse::fromEntity).collect(Collectors.toList()));
        } else {
            res.setTotalItems(0);
            res.setPurchasedItems(0);
        }
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
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

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public int getPurchasedItems() {
        return purchasedItems;
    }

    public void setPurchasedItems(int purchasedItems) {
        this.purchasedItems = purchasedItems;
    }

    public List<GroceryItemResponse> getItems() {
        return items;
    }

    public void setItems(List<GroceryItemResponse> items) {
        this.items = items;
    }
}
