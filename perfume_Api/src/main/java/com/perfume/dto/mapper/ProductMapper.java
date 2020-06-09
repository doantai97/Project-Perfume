package com.perfume.dto.mapper;

import com.nmhung.mapper.BaseConver;
import com.perfume.dto.*;
import com.perfume.entity.Producer;
import com.perfume.entity.Product;
import com.perfume.entity.Target;
import com.perfume.entity.Version;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ProductMapper extends AbstractConver<Product, ProductDTO> {

    public ProductMapper() {
        super();
//        this.modelMapper.getConfiguration().setAmbiguityIgnored(true);
    }



    @Override
    public ProductDTO toDTO(Product entity) {
        ProductDTO toDTO = super.toDTO(entity);
        entity.setHighlight(entity.highlight.toUpperCase());
        toDTO.setHighlights(super.converToArray(entity.getHighlight()));
        return toDTO;
    }

    @Override
    public Product toEntity(ProductDTO dto) {
        Product toEntity = super.toEntity(dto);
        toEntity.setHighlight(super.converToString(dto.getHighlights()));
        toEntity.setHighlight(toEntity.highlight.toUpperCase());
        return toEntity;
    }
}
