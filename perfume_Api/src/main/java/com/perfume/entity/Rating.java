package com.perfume.entity;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Rating extends BaseEntity {
    public int score;

    @Column(name = "user_id", insertable = false, updatable = false)
    public Long userId;

    @Column(name = "product_id", insertable = false, updatable = false)
    public Long productId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    public User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    public Product product;

    public Rating() {
    }

    public Rating(int score, Long userId, Long productId, User user, Product product) {
        this.score = score;
        this.userId = userId;
        this.productId = productId;
        this.user = user;
        this.product = product;
    }
}
