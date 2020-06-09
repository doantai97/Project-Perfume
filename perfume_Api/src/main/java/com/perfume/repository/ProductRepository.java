package com.perfume.repository;

import com.perfume.entity.Product;
import com.perfume.repository.custom.ProductRepositoryCustom;
import com.perfume.repository.custom.impl.BaseRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long>, ProductRepositoryCustom {
    boolean existsById(Long id);
    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code,Long id);
}
