package com.perfume.entity;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Version extends BaseEntity {
    public String name;
    public long price;
    public long total;
    public Integer totalSold;
    @ManyToOne
    @JoinColumn(name = "product_id")
    public Product product;

    @OneToMany(mappedBy = "version")
    public List<CartItem> cartItems;

    public Version() {
    }

    public Version(String name, long price, long total, Product product, List<CartItem> cartItems) {
        this.name = name;
        this.price = price;
        this.total = total;
        this.product = product;
        this.cartItems = cartItems;
    }
}
