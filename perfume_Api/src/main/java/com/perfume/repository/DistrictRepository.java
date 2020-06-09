package com.perfume.repository;

import com.perfume.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District,Integer> {
    List<District> findByProvinceId(Integer provinceId);
}
