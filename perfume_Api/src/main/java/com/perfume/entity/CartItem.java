package com.perfume.entity;

import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import com.perfume.dto.BaseDTO;
import com.perfume.dto.search.CartItemSearch;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@Data
@Entity
@TableName(searchClass = CartItemSearch.class)
@EqualsAndHashCode(callSuper = true)
public class CartItem extends BaseEntity {


    @QueryField
    public Integer quantity;

    @ManyToOne
    @JoinColumn(name = "user_id")
    public User user;

    @ManyToOne
    @JoinColumn(name = "version_product_id")
    public Version version;

    public CartItem() {
    }


}
