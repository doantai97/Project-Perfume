package com.perfume.repository.custom.impl;

import com.perfume.entity.Category;
import com.perfume.repository.custom.CategoryRepositoryCustom;

public class CategoryRepositoryCustomImpl extends BaseRepositoryCustom<Category> implements CategoryRepositoryCustom {
    public CategoryRepositoryCustomImpl() {
        super("C");
    }
}
