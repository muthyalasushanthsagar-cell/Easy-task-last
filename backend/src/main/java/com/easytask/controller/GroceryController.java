package com.easytask.controller;

import com.easytask.dto.GroceryItemRequest;
import com.easytask.dto.GroceryItemResponse;
import com.easytask.dto.GroceryListRequest;
import com.easytask.dto.GroceryListResponse;
import com.easytask.service.GroceryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grocery-lists")
public class GroceryController {

    private final GroceryService groceryService;

    public GroceryController(GroceryService groceryService) {
        this.groceryService = groceryService;
    }

    @GetMapping
    public ResponseEntity<List<GroceryListResponse>> getAllLists() {
        return ResponseEntity.ok(groceryService.getAllLists());
    }

    @PostMapping
    public ResponseEntity<GroceryListResponse> createList(@Valid @RequestBody GroceryListRequest request) {
        GroceryListResponse created = groceryService.createList(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroceryListResponse> getListById(@PathVariable Long id) {
        return ResponseEntity.ok(groceryService.getListById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroceryListResponse> updateList(
            @PathVariable Long id,
            @Valid @RequestBody GroceryListRequest request
    ) {
        return ResponseEntity.ok(groceryService.updateList(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Long id) {
        groceryService.deleteList(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{listId}/items")
    public ResponseEntity<GroceryItemResponse> addItem(
            @PathVariable Long listId,
            @Valid @RequestBody GroceryItemRequest request
    ) {
        GroceryItemResponse item = groceryService.addItem(listId, request);
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<GroceryItemResponse> updateItem(
            @PathVariable Long itemId,
            @Valid @RequestBody GroceryItemRequest request
    ) {
        return ResponseEntity.ok(groceryService.updateItem(itemId, request));
    }

    @PatchMapping("/items/{itemId}/toggle")
    public ResponseEntity<GroceryItemResponse> toggleItemPurchased(@PathVariable Long itemId) {
        return ResponseEntity.ok(groceryService.toggleItemPurchased(itemId));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        groceryService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
