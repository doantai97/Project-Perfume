package com.perfume.repository.custom.impl;

import com.nmhung.sql.BaseDAO;
import com.perfume.entity.Target;
import com.perfume.repository.custom.BaseRepository;
import com.perfume.repository.custom.TargetRepositoryCustom;
import org.springframework.stereotype.Repository;

@Repository
public class TargetRepositoryCustomImpl extends BaseRepositoryCustom<Target> implements TargetRepositoryCustom {
    public TargetRepositoryCustomImpl() {
        super("Ta");
    }
}
