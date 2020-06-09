package com.perfume.dto.mapper;

import com.perfume.entity.BaseEntity;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;

import java.lang.reflect.ParameterizedType;

public class AbstractConver<E, D> {
    protected ModelMapper modelMapper;

    public AbstractConver() {
        modelMapper = new ModelMapper();
    }

    public D toDTO(E entity) {
        return modelMapper.map(entity, this.getTypeDTO());
    }

    public E toEntity(D dto) {
        return modelMapper.map(dto, this.getTypeEntity());
    }

    public String[] converToArray(String data) {
        return StringUtils.isNotBlank(data) ? data.split("~") : null;
    }

    public String converToString(String[] data) {
        return data != null ? StringUtils.join(data, "~") : null;
    }

    protected E toEntity(Class<E> type, D source) {
        return modelMapper.map(source, type);
    }

    protected D toDTO(Class<D> type, E source) {
        return modelMapper.map(source, type);
    }

    private Class<D> getTypeDTO() {
        return this.getType(1);
    }

    private Class<E> getTypeEntity() {
        return this.getType(0);
    }

    private Class getType(int index) {
        Class type = (Class)((ParameterizedType)this.getClass().getGenericSuperclass()).getActualTypeArguments()[index];
        return type;
    }

}
