package com.perfume.repository;

import com.perfume.entity.CartItem;
import com.perfume.repository.custom.CartItemRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long>, CartItemRepositoryCustom {
    List<CartItem> findByUserId(Long id);
    boolean existsByUserIdAndVersionId(Long userId,Long versionId);
    CartItem findByUserIdAndVersionId(Long userId,Long versionId);
}
