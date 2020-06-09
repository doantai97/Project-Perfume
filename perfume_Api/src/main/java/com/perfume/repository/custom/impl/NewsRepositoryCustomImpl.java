package com.perfume.repository.custom.impl;

import com.perfume.entity.News;
import com.perfume.repository.custom.NewsRepositoryCustom;

public class NewsRepositoryCustomImpl extends BaseRepositoryCustom<News> implements NewsRepositoryCustom {
    public NewsRepositoryCustomImpl() {
        super("news");
    }
}
