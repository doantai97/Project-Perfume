package com.perfume.repository.custom.impl;

import com.perfume.entity.Checkout;
import com.perfume.entity.User;
import com.perfume.repository.custom.CheckoutRepositoryCustom;
import org.springframework.stereotype.Repository;
import org.springframework.util.MultiValueMap;

import javax.persistence.Query;
import javax.persistence.Tuple;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Repository
public class CheckoutRepositoryCustomImpl extends BaseRepositoryCustom<Checkout> implements CheckoutRepositoryCustom {
    public CheckoutRepositoryCustomImpl() {
        super("CO");
    }

    @Override
    public Map<String, Object> converEntityToMapQuery(Object e) {
        Checkout checkout = (Checkout) e;
        Map<String, Object> map = super.converEntityToMapQuery(checkout);
        if (checkout.getSearch() != null) {
            if (!checkout.getSearch().trim().equalsIgnoreCase("")) {
                map.put("search", checkout.getSearch().trim());
            }
        }

        if (checkout.getIsCoupon() != null) {
            map.put("isCoupon", checkout.getIsCoupon());
        }
        return map;
    }

    @Override
    public String createWhereQuery(Map<String, Object> queryParams, Map<String, Object> values) {
        StringBuilder sql = new StringBuilder(" where 1 = 1 ");
        List<String> queryByClass = this.getQueryParamByClass(this.searchType);
        queryByClass.forEach((item) -> {
            if (queryParams.containsKey(item)) {
                String tmp = item.replace(".", "");

                if (item.equalsIgnoreCase("user.id")) {
                    User user = (User) queryParams.get(item);
                    sql.append(" and " + this.asName + "." + item);
                    if (user.getId() == null) {
                        sql.append(" is null");
                    } else {
                        sql.append(" = :" + tmp);
                        values.put(tmp, user.getId());
                    }
                } else {
                    sql.append(" and " + this.asName + "." + item + " = :" + tmp);
                    values.put(tmp, queryParams.get(item));
                }
            }

        });
        if (queryParams.containsKey("isCoupon")) {
            Boolean isCoupon = (Boolean) queryParams.get("isCoupon");
            sql.append(" AND CO.coupon.id IS ").append(isCoupon ? " NOT " : " ").append(" NULL ");
        }

        if (queryParams.containsKey("search")) {
            sql.append(" AND ( ");
            String search = (String) queryParams.get("search");
            sql.append(" lower(CO.firstname) like lower(:searchfirstname) ");
            values.put("searchfirstname", "%" + search + "%");

            sql.append(" OR lower(CO.lastname) like lower(:searchlastname) ");
            values.put("searchlastname", "%" + search + "%");

            sql.append(" OR lower(CO.phone) like lower(:searchphone) ");
            values.put("searchphone", "%" + search + "%");

            sql.append(" OR lower(CO.email) like lower(:searchemail) ");
            values.put("searchemail", "%" + search + "%");

            sql.append(" OR lower(CO.address) like lower(:searchaddress) ");
            values.put("searchaddress", "%" + search + "%");
            sql.append(" )");
        }
        return sql.toString();
    }

    @Override
    public List<Tuple> getChart(MultiValueMap<String, String> map) {
        String type;
        Integer status;
        String sql = "";
        try {
            type = map.getFirst("type");
            status = Integer.parseInt(Objects.requireNonNull(map.getFirst("status")));
        } catch (Exception e) {
            return null;
        }
        if (type == null) return null;
        if (type.equalsIgnoreCase("week")) {
            sql = "SELECT count(*) as count, sum(finalprice) as value," +
                    " WEEKDAY(created_at) as label FROM checkout" +
                    " WHERE status = :status and" +
                    " WEEKOFYEAR(created_at) = WEEKOFYEAR(NOW()) and" +
                    " MONTH(created_at) = MONTH(NOW()) and" +
                    " YEAR(created_at) = YEAR(NOW())" +
                    " GROUP BY WEEKDAY(created_at) ORDER BY label ASC";
        } else if (type.equalsIgnoreCase("month")) {
            sql = "SELECT count(*) as count, sum(finalprice) as value," +
                    " MONTH(created_at) as label FROM checkout" +
                    " WHERE status = :status and" +
                    " YEAR(created_at) = YEAR(NOW())" +
                    " GROUP BY MONTH(created_at) ORDER BY label ASC";
        } else {
            return null;
        }
        Query query = this.entityManager.createNativeQuery(sql, Tuple.class);
        query.setParameter("status", status);
        return query.getResultList();
    }
}
