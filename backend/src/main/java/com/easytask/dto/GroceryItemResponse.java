package com.easytask.dto;

import com.easytask.entity.GroceryItem;
import java.time.LocalDateTime;

public class GroceryItemResponse {

    private Long id;
    private Long groceryListId;
    private String name;
    private String quantity;
    private String category;
    private boolean purchased;
    private LocalDateTime createdAt;

    public GroceryItemResponse() {
    }

    public static GroceryItemResponse fromEntity(GroceryItem item) {
        if (item == null) return null;
        GroceryItemResponse res = new GroceryItemResponse();
        res.setId(item.getId());
        if (item.getGroceryList() != null) {
            res.setGroceryListId(item.getGroceryList().getId());
        }
        res.setName(item.getName());
        res.setQuantity(item.getQuantity());
        res.setCategory(item.getCategory());
        res.setPurchased(item.isPurchased());
        res.setCreatedAt(item.getCreatedAt());
        return res;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroceryListId() {
        return groceryListId;
    }

    public void setGroceryListId(Long groceryListId) {
        this.groceryListId = groceryListId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isPurchased() {
        return purchased;
    }

    public void setPurchased(boolean purchased) {
        this.purchased = purchased;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
