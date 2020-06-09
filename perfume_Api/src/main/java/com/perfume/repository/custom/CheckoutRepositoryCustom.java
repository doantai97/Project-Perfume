package com.perfume.repository.custom;


import com.perfume.entity.Checkout;
import org.springframework.stereotype.Repository;
import org.springframework.util.MultiValueMap;

import javax.persistence.Tuple;
import java.util.List;

@Repository
public interface CheckoutRepositoryCustom extends BaseRepository<Checkout>{
    List<Tuple> getChart(MultiValueMap<String, String> map);
}
