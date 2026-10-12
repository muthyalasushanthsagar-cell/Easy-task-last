package com.easytask.service;

import com.easytask.dto.GroceryItemRequest;
import com.easytask.dto.GroceryItemResponse;
import com.easytask.dto.GroceryListRequest;
import com.easytask.dto.GroceryListResponse;
import com.easytask.entity.GroceryItem;
import com.easytask.entity.GroceryList;
import com.easytask.exception.ResourceNotFoundException;
import com.easytask.repository.GroceryItemRepository;
import com.easytask.repository.GroceryListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroceryService {

    private final GroceryListRepository groceryListRepository;
    private final GroceryItemRepository groceryItemRepository;

    public GroceryService(GroceryListRepository groceryListRepository, GroceryItemRepository groceryItemRepository) {
        this.groceryListRepository = groceryListRepository;
        this.groceryItemRepository = groceryItemRepository;
    }

    @Transactional(readOnly = true)
    public List<GroceryListResponse> getAllLists() {
        return groceryListRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(GroceryListResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GroceryListResponse getListById(Long id) {
        GroceryList list = groceryListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery list not found with id: " + id));
        return GroceryListResponse.fromEntity(list);
    }

    public GroceryListResponse createList(GroceryListRequest request) {
        GroceryList list = new GroceryList(
                request.getTitle().trim(),
                request.getDescription() != null ? request.getDescription().trim() : null,
                request.getColor() != null && !request.getColor().isBlank() ? request.getColor() : "#4f46e5"
        );
        GroceryList saved = groceryListRepository.save(list);
        return GroceryListResponse.fromEntity(saved);
    }

    public GroceryListResponse updateList(Long id, GroceryListRequest request) {
        GroceryList list = groceryListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery list not found with id: " + id));

        list.setTitle(request.getTitle().trim());
        list.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        if (request.getColor() != null && !request.getColor().isBlank()) {
            list.setColor(request.getColor());
        }

        GroceryList updated = groceryListRepository.save(list);
        return GroceryListResponse.fromEntity(updated);
    }

    public void deleteList(Long id) {
        GroceryList list = groceryListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery list not found with id: " + id));
        groceryListRepository.delete(list);
    }

    public GroceryItemResponse addItem(Long listId, GroceryItemRequest request) {
        GroceryList list = groceryListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery list not found with id: " + listId));

        GroceryItem item = new GroceryItem(
                request.getName().trim(),
                request.getQuantity() != null ? request.getQuantity().trim() : null,
                request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory().trim() : "General"
        );
        item.setPurchased(request.getPurchased() != null && request.getPurchased());

        list.addItem(item);
        GroceryItem saved = groceryItemRepository.save(item);
        return GroceryItemResponse.fromEntity(saved);
    }

    public GroceryItemResponse updateItem(Long itemId, GroceryItemRequest request) {
        GroceryItem item = groceryItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery item not found with id: " + itemId));

        item.setName(request.getName().trim());
        item.setQuantity(request.getQuantity() != null ? request.getQuantity().trim() : null);
        item.setCategory(request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory().trim() : "General");
        if (request.getPurchased() != null) {
            item.setPurchased(request.getPurchased());
        }

        GroceryItem updated = groceryItemRepository.save(item);
        return GroceryItemResponse.fromEntity(updated);
    }

    public GroceryItemResponse toggleItemPurchased(Long itemId) {
        GroceryItem item = groceryItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery item not found with id: " + itemId));

        item.setPurchased(!item.isPurchased());
        GroceryItem updated = groceryItemRepository.save(item);
        return GroceryItemResponse.fromEntity(updated);
    }

    public void deleteItem(Long itemId) {
        GroceryItem item = groceryItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Grocery item not found with id: " + itemId));

        GroceryList list = item.getGroceryList();
        if (list != null) {
            list.removeItem(item);
        }
        groceryItemRepository.delete(item);
    }
}
