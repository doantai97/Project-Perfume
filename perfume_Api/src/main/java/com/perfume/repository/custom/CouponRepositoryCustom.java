package com.perfume.repository.custom;

import com.perfume.entity.Coupon;

public interface CouponRepositoryCustom extends BaseRepository<Coupon>{
    boolean validateCoupon(String code);
    boolean changeCoupon(String code);
    Coupon getByCodeValidate(String code);
}
