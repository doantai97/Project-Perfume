package com.perfume.repository.custom.impl;

import com.perfume.entity.Comment;
import com.perfume.repository.custom.CommentRepositoryCustom;

import java.util.List;
import java.util.Map;

public class CommentRepositoryCustomImpl extends BaseRepositoryCustom<Comment> implements CommentRepositoryCustom {
    public CommentRepositoryCustomImpl() {
        super("Cm");
    }


    @Override
    public String createWhereQuery(Map<String, Object> queryParams, Map<String, Object> values) {
        StringBuilder sql = new StringBuilder(" where 1 = 1 ");
        List<String> queryByClass = this.getQueryParamByClass(this.searchType);
        queryByClass.forEach((item) -> {
            if (queryParams.containsKey(item)) {
                String tmp = item.replace(".", "");

                if(item.equalsIgnoreCase("parenComment.id")){
                    Comment paren = (Comment) queryParams.get(item);
                    sql.append(" and " + this.asName + "." + item);
                    if(paren.getId() == null){
                        sql.append( " is null");
                    }else{
                        sql.append(" = :" + tmp);
                        values.put(tmp,paren.getId());
                    }
                }else{
                    sql.append(" and " + this.asName + "." + item + " = :" + tmp);
                    values.put(tmp, queryParams.get(item));
                }
            }

        });
        return sql.toString();
    }

    @Override
    public List<String> getQueryParamByClass(Class clazz) {
        return super.getQueryParamByClass(clazz);
    }
}
