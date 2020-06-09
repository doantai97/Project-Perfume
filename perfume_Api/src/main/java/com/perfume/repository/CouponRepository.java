package com.perfume.repository;

import com.perfume.entity.Coupon;
import com.perfume.repository.custom.CouponRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long>, CouponRepositoryCustom {
}
