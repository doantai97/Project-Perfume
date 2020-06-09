package com.perfume.repository;

import com.perfume.entity.DisplayStatic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisplayStaticRepository extends JpaRepository<DisplayStatic, Long> {
    DisplayStatic findByType(String type);

    boolean existsByType(String type);
}
