package com.perfume.repository;

import com.perfume.entity.CheckoutItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutItemRepository extends JpaRepository<CheckoutItem, Long> {
}
