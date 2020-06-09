package com.perfume.repository.custom.impl;

import com.perfume.entity.User;
import com.perfume.repository.custom.BaseRepository;
import com.perfume.repository.custom.UserRepositoryCustom;

import java.util.Map;

public class UserRepositoryCustomImpl extends BaseRepositoryCustom<User> implements UserRepositoryCustom {
    public UserRepositoryCustomImpl() {
        super("U");
    }


    @Override
    public String createWhereQuery(Map<String, Object> queryParams, Map<String, Object> values) {
        String sql = super.createWhereQuery(queryParams, values);
        sql += " AND U.username <> :admin ";
        values.put("admin", "admin");
        return sql;
    }
}
