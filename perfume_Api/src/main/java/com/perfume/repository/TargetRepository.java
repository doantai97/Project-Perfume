package com.perfume.repository;

import com.perfume.entity.Target;
import com.perfume.repository.custom.TargetRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TargetRepository extends JpaRepository<Target, Long>, TargetRepositoryCustom {
    Target findByName(String name);
}
