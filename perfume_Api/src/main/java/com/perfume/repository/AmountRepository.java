package com.perfume.repository;

import com.perfume.entity.Amount;
import com.perfume.repository.custom.AmountRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AmountRepository extends JpaRepository<Amount, Long>, AmountRepositoryCustom {
}
