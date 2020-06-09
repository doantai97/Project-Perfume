package com.perfume.repository.custom.impl;

import com.nmhung.sql.model.ResponseBaseDAO;
import com.perfume.constant.StatusEnum;
import com.perfume.dto.OderBy;
import com.perfume.dto.search.ProductSearch;
import com.perfume.entity.Product;
import com.perfume.entity.User;
import com.perfume.repository.custom.BaseRepository;
import com.perfume.repository.custom.ProductRepositoryCustom;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.MultiValueMap;

import javax.persistence.*;
import java.util.*;

public class ProductRepositoryCustomImpl extends BaseRepositoryCustom<Product> implements ProductRepositoryCustom {

    public ProductRepositoryCustomImpl() {
        super("P", true);
//        this.fistQuery = "SELECT P, SUM(P.id) as avgPrice FROM Product P ";
    }

    private String asCategory = "Category";
    private String asTarget = "Target";

    @Override
    public Page<Product> getAll(Pageable pageable) {
        ProductSearch productSearch = new ProductSearch();
        productSearch.setStatus(StatusEnum.ACTIVE.getValue());
        return findPage(productSearch, pageable);
    }

    @Override
    protected Query findBase(Object e) {
        ResponseBaseDAO responseBaseDAO = super.createQuery(e);
        Query query = entityManager.createQuery(responseBaseDAO.getSql());
        responseBaseDAO.getValues().forEach(query::setParameter);
        return query;
    }

    //    @Override
//    protected Query findBase(Object e) {
//        ProductSearch productSearch = (ProductSearch) e;
//        Map<String, Object> map = super.converEntityToMapQuery(productSearch);
//        if (productSearch.getMaxPrice() != null) {
//            map.put("maxPrice", productSearch.getMaxPrice());
//        }
//        if (productSearch.getMaxPrice() != null) {
//            map.put("minPrice", productSearch.getMinPrice());
//        }
//        ResponseBaseDAO responseBaseDAO = super.createQuery(map);
//        Query query = entityManager.createQuery(responseBaseDAO.getSql(), type);
//        responseBaseDAO.getValues().forEach(query::setParameter);
//        return query;
//    }


    @Override
    public String createJoinQuery(Map<String, Object> queryParams, Map<String, Object> values) {
        String sql = super.createJoinQuery(queryParams, values);
        sql += " JOIN P.category as " + asCategory + " ";

        if (queryParams.containsKey("targetIds")) {
            sql += " JOIN P.targets as " + asTarget + " ";
        }
        return sql;
    }

    @Override
    public Map<String, Object> converEntityToMapQuery(Object e) {
        ProductSearch productSearch = (ProductSearch) e;
        Map<String, Object> map = super.converEntityToMapQuery(productSearch);

        if (productSearch.getTargetIds() != null) {
            if (productSearch.getTargetIds().length > 0) {
                map.put("targetIds", productSearch.getTargetIds());
            }

        }

        if (productSearch.getMaxPrice() != null) {
            map.put("maxPrice", productSearch.getMaxPrice());
        }
        if (productSearch.getMaxPrice() != null) {
            map.put("minPrice", productSearch.getMinPrice());
        }
        if (productSearch.getHighlights() != null) {
            map.put("highlights", productSearch.getHighlights());
        }
        if (productSearch.getCategoryCode() != null) {
            map.put("categoryCode", productSearch.getCategoryCode());
        }
        if (productSearch.getVersionId() != null) {
            map.put("versionId", productSearch.getVersionId());
        }

        if (productSearch.getOderBy() != null) {
            map.put("oderBy", productSearch.getOderBy());
        }
        if (productSearch.getSearch() != null) {
            map.put("search", productSearch.getSearch());
        }
        return map;
    }

    @Override
    public String createOrderQuery(Map<String, Object> queryParams) {
        if (queryParams.get("oderBy") != null) {
            OderBy oderBy = (OderBy) queryParams.get("oderBy");
            String sql = " order by";
            if (oderBy.getName() != null) {
                String name = oderBy.getName();
                if (name.equalsIgnoreCase("price")) {
                    sql += " P.avgPrice ";
                    sql += oderBy.getType() != null ? oderBy.getType() + " " : " ";
                } else if (name.equalsIgnoreCase("countCheckoutItem")) {
                    sql += " P.totalSold ";
                    sql += oderBy.getType() != null ? oderBy.getType() + " " : " ";
                } else if (name.equalsIgnoreCase("random")) {
                    sql += " RAND() ";
                }
                return sql;
            }
        }

        return super.createOrderQuery(queryParams);
    }

    @Override
    public String createWhereQuery(Map<String, Object> queryParams, Map<String, Object> values) {
        String sql = super.createWhereQuery(queryParams, values);

        if (queryParams.get("maxPrice") != null) {
            sql += " AND " + asName + ".id IN ( SELECT distinct V.product.id FROM Version V WHERE V.price <= :maxPrice ) ";
            values.put("maxPrice", queryParams.get("maxPrice"));
        }
        if (queryParams.get("minPrice") != null) {
            sql += " AND " + asName + ".id IN ( SELECT distinct V.product.id FROM Version V WHERE V.price >= :minPrice ) ";
            values.put("minPrice", queryParams.get("minPrice"));
        }
        if (queryParams.containsKey("search")) {
            sql += " AND upper(" + asName + ".name) like upper(:searchName) ";
            values.put("searchName", "%" + queryParams.get("search") + "%");
        }

        if (queryParams.get("highlights") != null) {
            String[] highlights = (String[]) queryParams.get("highlights");
            for (int i = 0; i < highlights.length; ++i) {
                String tmp = "highlight" + i;
                sql += " AND highlight LIKE :" + tmp + " ";
                values.put(tmp, "%" + highlights[i].toUpperCase() + "%");
            }
        }
        if (queryParams.get("categoryCode") != null) {
            sql += " AND " + asCategory + ".code = :categoryCode ";
            values.put("categoryCode", queryParams.get("categoryCode"));
        }

        if (queryParams.get("versionId") != null) {
            sql += " AND " + asName + ".id IN ( SELECT distinct V.product.id FROM Version V WHERE V.id = :versionId ) ";
            values.put("versionId", queryParams.get("versionId"));
        }

        if (queryParams.containsKey("targetIds")) {
            Long[] targetIds = (Long[]) queryParams.get("targetIds");
            for (int i = 0; i < 1; ++i) {
                sql += " AND " + asTarget + ".id = :targetIds" + i + " ";
                values.put("targetIds" + i, targetIds[i]);
            }
        }
//        if (queryParams.get("magiamgiaId") != null) {
//            sql += " AND " + asCategory + ".code = :categoryCode ";
//            values.put("categoryCode", queryParams.get("categoryCode"));
//        }
//NEW HOT
        return sql;
    }
}
