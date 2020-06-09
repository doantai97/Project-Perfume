package com.perfume.dto;

import lombok.Builder;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
public class VersionDTO {
    private Long id;
    public String name;
    public long price;
    public int total;
    public Long productId;
    public Integer totalSold;
//    public ProductDTO product;


}
