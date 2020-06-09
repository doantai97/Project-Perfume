package com.perfume.repository;

import com.perfume.entity.Fragrant;
import com.perfume.repository.custom.BaseRepository;
import com.perfume.repository.custom.FragrantRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FragrantRepository extends JpaRepository<Fragrant, Long>, FragrantRepositoryCustom {
}
