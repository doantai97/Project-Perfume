package com.perfume.repository;

import com.perfume.entity.News;
import com.perfume.repository.custom.NewsRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long>, NewsRepositoryCustom {
}
