package com.perfume.repository;

import com.perfume.entity.Producer;
import com.perfume.repository.custom.ProducerRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProducerRepository extends JpaRepository<Producer, Long>, ProducerRepositoryCustom {
//    boolean existsByCode(String code);
    Page<Producer> findAll(Pageable paging);
}
