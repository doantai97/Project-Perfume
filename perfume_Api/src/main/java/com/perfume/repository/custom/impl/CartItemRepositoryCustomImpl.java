package com.perfume.repository.custom.impl;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.search.CartItemSearch;
import com.perfume.dto.search.ProductSearch;
import com.perfume.entity.CartItem;
import com.perfume.repository.custom.CartItemRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public class CartItemRepositoryCustomImpl extends BaseRepositoryCustom<CartItem> implements CartItemRepositoryCustom {
    public CartItemRepositoryCustomImpl() {
        super("CI");
    }

    @Override
    public Page<CartItem> getAll(Pageable pageable) {
        CartItemSearch cartItemSearch = new CartItemSearch();
        cartItemSearch.setStatus(StatusEnum.ACTIVE.getValue());
        return findPage(cartItemSearch, pageable);
    }


//    @Override
//    public Map<String, Object> converEntityToMapQuery(Object e) {
//        ProductSearch productSearch = (ProductSearch) e;
//        Map<String, Object> map = super.converEntityToMapQuery(productSearch);
//        return map;
//    }
//
//
//    @Override
//    public String createWhereQuery(Map<String, Object> queryParams, Map<String, Object> values) {
//        String sql = super.createWhereQuery(queryParams, values);
//
//        if (queryParams.get("maxPrice") != null) {
//            sql += " AND " + asName + ".id IN ( SELECT distinct V.product.id FROM Version V WHERE V.price <= :maxPrice ) ";
//            values.put("maxPrice", queryParams.get("maxPrice"));
//        }
//        if (queryParams.get("minPrice") != null) {
//            sql += " AND " + asName + ".id IN ( SELECT distinct V.product.id FROM Version V WHERE V.price >= :minPrice ) ";
//            values.put("minPrice", queryParams.get("minPrice"));
//        }
//
//        if (queryParams.get("highlights") != null) {
//            String[] highlights = (String[]) queryParams.get("highlights");
//            for (int i = 0; i < highlights.length; ++i) {
//                String tmp = "highlight" + i;
//                sql += " AND highlight LIKE :" + tmp + " ";
//                values.put(tmp, "%" + highlights[i].toUpperCase() + "%");
//            }
//        }
//
//        return sql;
//    }
}
