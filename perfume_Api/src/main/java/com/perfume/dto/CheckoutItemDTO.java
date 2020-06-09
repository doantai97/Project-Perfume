package com.perfume.dto;

import com.nmhung.sql.BaseDAO;
import lombok.Builder;
import lombok.Data;

import javax.persistence.*;

@Data
public class CheckoutItemDTO extends BaseDTO {

    public Long userId;

    public VersionDTO version;

    public int quantity;

    public ProductDTO product;

//    public CheckoutDTO checkout;
}
