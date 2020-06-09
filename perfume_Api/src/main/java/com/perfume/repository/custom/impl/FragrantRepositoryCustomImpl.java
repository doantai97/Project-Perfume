package com.perfume.repository.custom.impl;

import com.perfume.entity.Fragrant;
import com.perfume.repository.FragrantRepository;
import com.perfume.repository.custom.FragrantRepositoryCustom;

public class FragrantRepositoryCustomImpl extends BaseRepositoryCustom<Fragrant> implements FragrantRepositoryCustom {
    public FragrantRepositoryCustomImpl() {
        super("F");
    }
}
