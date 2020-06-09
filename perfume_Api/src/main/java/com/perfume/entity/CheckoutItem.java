package com.perfume.entity;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class CheckoutItem extends BaseEntity {


    public int quantity;

    @ManyToOne
    @JoinColumn(name = "version_product_id")
    public Version version;
    @ManyToOne
    @JoinColumn(name = "checkout_id")
    public Checkout checkout;

    public CheckoutItem() {
    }

    public CheckoutItem(int quantity, Version version, Checkout checkout) {
        this.quantity = quantity;
        this.version = version;
        this.checkout = checkout;
    }
}
