package com.perfume.repository.custom.impl;

import com.perfume.entity.Amount;
import com.perfume.repository.custom.AmountRepositoryCustom;

public class AmountRepositoryCustomImpl  extends BaseRepositoryCustom<Amount> implements AmountRepositoryCustom {
    public AmountRepositoryCustomImpl() {
        super("A");
    }
}
