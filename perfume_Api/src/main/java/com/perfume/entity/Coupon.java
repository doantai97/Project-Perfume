package com.perfume.entity;

import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@TableName
public class Coupon extends BaseEntity {

    @Column(unique=true)
    @QueryField
    public String code;

    @QueryField
    public Integer percent;

    @QueryField
    public Date startDate;

    @QueryField
    public Date endDate;

    @QueryField
    public Integer total;

    @OneToMany(mappedBy = "coupon")
    List<Checkout> checkouts;

    public Coupon() {
    }
}
