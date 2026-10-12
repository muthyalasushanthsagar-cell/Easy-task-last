package com.easytask.repository;

import com.easytask.entity.GroceryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroceryItemRepository extends JpaRepository<GroceryItem, Long> {
    List<GroceryItem> findByGroceryListIdOrderByIdAsc(Long groceryListId);
    void deleteByGroceryListId(Long groceryListId);
}
