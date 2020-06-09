package com.perfume.repository.custom.impl;

import com.perfume.entity.Producer;
import com.perfume.repository.custom.ProducerRepositoryCustom;

public class ProducerRepositoryCustomImpl extends BaseRepositoryCustom<Producer> implements ProducerRepositoryCustom {
    public ProducerRepositoryCustomImpl() {
        super("P");
    }
}
