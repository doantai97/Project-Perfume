package com.perfume.repository.custom;

import com.perfume.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.MultiValueMap;

import java.util.List;


public interface BaseRepository<E> {
    Page<E> filterPage(MultiValueMap<String, Object> queryParams, Pageable pageable);


    List<E> filter(MultiValueMap<String, Object> queryParams);
    Long count(MultiValueMap<String, Object> queryParams);

    List<E> find(Object e);



    Long count(Object e);
    Page<E> findPage(Object e,Pageable pageable);
    boolean update(Object e);
    boolean updateFull(Object e);
    boolean changeStatus(Long id, int status);
    Page<E> getAll(Pageable pageable);
//    List<E> getAll();
//    List<E> getOne();
}
