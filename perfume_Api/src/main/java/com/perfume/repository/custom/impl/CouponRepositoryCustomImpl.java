package com.perfume.repository.custom.impl;

import com.perfume.entity.Coupon;
import com.perfume.repository.custom.CouponRepositoryCustom;
import org.springframework.stereotype.Repository;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;


import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.*;

@Repository
public class CouponRepositoryCustomImpl extends BaseRepositoryCustom<Coupon> implements CouponRepositoryCustom {
    public CouponRepositoryCustomImpl() {
        super("Cp");
    }

    @Override
    @Transactional
    public boolean validateCoupon(String code) {
        MultiValueMap<String, Object> multiValueMap = new LinkedMultiValueMap<>();
        multiValueMap.put("validate", Arrays.asList(code));
        List<Coupon> coupons = this.filter(multiValueMap);
        return !coupons.isEmpty();
    }

    @Override
    public String createWhereQuery(Map<String, Object> queryParams, Map<String, Object> values) {
        String sql = super.createWhereQuery(queryParams, values);
        if (queryParams.containsKey("validate")) {
            sql += " AND Cp.total > 0 AND  Cp.startDate < :validateStart AND Cp.endDate > :validateEnd AND Cp.code = :validateCode";
            Date now = new Date();
            values.put("validateCode", queryParams.get("validate"));
            values.put("validateStart", now);
            values.put("validateEnd", now);
        }
        return sql;
    }

    @Override
    @Transactional
    public boolean changeCoupon(String code) {
        String hql = "update " + this.nameTable + " " + this.asName + " set ";
        hql += "Cp.total = Cp.total - 1 WHERE Cp.code :code ";
        Query query = entityManager.createQuery(hql);
        query.setParameter("code", code);
        int rs = query.executeUpdate();
        return rs > 0;
    }


    @Override
    public Coupon getByCodeValidate(String code) {
        MultiValueMap<String, Object> multiValueMap = new LinkedMultiValueMap<>();
        multiValueMap.put("validate", Arrays.asList(code));
        List<Coupon> coupons = this.filter(multiValueMap);
        return coupons.isEmpty() ? null : coupons.get(0);
    }
}
