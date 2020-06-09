package com.perfume.repository.custom.impl;

import com.nmhung.sql.BaseDAO;
import com.nmhung.sql.model.ResponseBaseDAO;
import com.perfume.constant.StatusEnum;
import com.perfume.entity.BaseEntity;
import com.perfume.entity.Product;
import com.perfume.repository.custom.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class BaseRepositoryCustom<E extends BaseEntity> extends BaseDAO<E> implements BaseRepository<E> {
//    protected String nameTable = getType(0).getName();
//
//    private Class<E> getType(int index) {
//        Class<E> type = (Class<E>)
//                ((ParameterizedType) getClass()
//                        .getGenericSuperclass())
//                        .getActualTypeArguments()[index];
//        return type;
//    }
//
//    protected String asName = "T";


    public BaseRepositoryCustom(String asName) {
        super(asName);
//        this.asName = asName;
    }
    public BaseRepositoryCustom(String asName,boolean isDistinct ) {
        super(asName);
        if(isDistinct){
            this.fistQuery = String.join(" ", "SELECT distinct ", asName, "FROM", this.nameTable, asName, " ");
            this.fistQueryCount = String.join(" ", "SELECT", "COUNT( distinct ", asName, ")", "FROM", this.nameTable, asName, " ");
        }

//        this.asName = asName;
    }


    private Map<String, Object> toMap(MultiValueMap<String, Object> multiValueMap) {
        Map<String, Object> map = new HashMap<>();
        multiValueMap.forEach((s, objects) -> {
            if(objects.size() == 1){
                map.put(s, objects.get(0));
            }else{
                map.put(s,objects);
            }

        });
        return map;
    }

    @PersistenceContext
    protected EntityManager entityManager;

    @Override
    public Page<E> filterPage(MultiValueMap<String, Object> queryParams, Pageable pageable) {
        ResponseBaseDAO responseBaseDAO = super.createQuery(toMap((queryParams)));
        Query query = entityManager.createQuery(responseBaseDAO.getSql(), type);
        responseBaseDAO.getValues().forEach(query::setParameter);
        query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        query.setMaxResults(pageable.getPageSize());
        List<E> list = query.getResultList();
        Long count = count(queryParams);
        return new PageImpl<E>(list, pageable, count);
    }

    @Override
    public List<E> filter(MultiValueMap<String, Object> queryParams) {
        ResponseBaseDAO responseBaseDAO = super.createQuery(toMap((queryParams)));
        Query query = entityManager.createQuery(responseBaseDAO.getSql(), type);
        responseBaseDAO.getValues().forEach(query::setParameter);
        List<E> list = query.getResultList();
        return list;
//        Long count = count(queryParams);
//        return new PageImpl<E>(list, pageable, count);
    }

    @Override
    public Long count(MultiValueMap<String, Object> queryParams) {
        ResponseBaseDAO responseBaseDAO = super.createQueryCount(toMap((queryParams)));
        Query query = entityManager.createQuery(responseBaseDAO.getSql(), Long.class);
        responseBaseDAO.getValues().forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    @Override
    public List<E> find(Object e) {
        List<E> list = findBase(e).getResultList();
        return list;
    }

    protected Query findBase(Object e){
        ResponseBaseDAO responseBaseDAO = super.createQuery(e);
        Query query = entityManager.createQuery(responseBaseDAO.getSql(), type);
        responseBaseDAO.getValues().forEach(query::setParameter);
        return query;
    }

    @Override
    public Page<E> findPage(Object e, Pageable pageable) {
        Query query = findBase(e);
        query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        query.setMaxResults(pageable.getPageSize());

        Long count = count(e);
        List<E> list = query.getResultList();
        return new PageImpl<E>(list, pageable, count);
    }

    @Override
    public Long count(Object e) {
        ResponseBaseDAO responseBaseDAO = super.createQueryCount(e);
        Query query = entityManager.createQuery(responseBaseDAO.getSql(), Long.class);
        responseBaseDAO.getValues().forEach(query::setParameter);
        return (Long) query.getSingleResult();
    }

    @Override
    @Transactional
    public boolean update(Object e) {
        ResponseBaseDAO responseBaseDAO = super.createUpdate(e);
        Query query = this.entityManager.createQuery(responseBaseDAO.getSql());//        String sql = String.join(" ", "SELECT", asName, "FROM", nameTable, asName, " ");
        responseBaseDAO.getValues().forEach(query::setParameter);
        int rs = query.executeUpdate();


        return rs > 0;
    }

    @Override
    public boolean updateFull(Object e) {
        ResponseBaseDAO responseBaseDAO = super.createUpdateFull(e);
        Query query = this.entityManager.createQuery(responseBaseDAO.getSql());
        responseBaseDAO.getValues().forEach(query::setParameter);
        int rs = query.executeUpdate();
//        this.entityManager.getTransaction().commit();
//        this.entityManager.close();
        return rs > 0;
    }

    @Override
    public boolean changeStatus(Long id, int status) {
            E e = newInstance();
            if(e == null){
                return false;
            }
            e.setStatus(status);
            e.setId(id);

        return this.update(e);

    }

    private E newInstance(){
        try {
            return type.newInstance();
        } catch (InstantiationException ex) {
            ex.printStackTrace();
        } catch (IllegalAccessException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public Page<E> getAll(Pageable pageable) {
        E e = this.newInstance();
        e.setStatus(StatusEnum.ACTIVE.getValue());
        return findPage(e,pageable);
    }


}
