package com.perfume.entity;

import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import com.perfume.dto.search.ProductSearch;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
@Entity
@TableName(searchClass = ProductSearch.class)
@EqualsAndHashCode(callSuper = true)
public class Product extends BaseEntity {
    public String name;

    @Column(unique = true)
    @QueryField
    public String code;
    @QueryField
    public String highlight;
    @QueryField
    public Date MFG;
    @QueryField
    public Date EXP;

    @QueryField
    public Integer year;

    public String image;
    @Lob
    public String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    public Category category;

    public Double avgPrice;


    public Integer totalSold;

//    @QueryField(name = "category.id")
//    @Column(name = "category_id", updatable = false, insertable = false)
//    public Long category_id;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producer_id")
    public Producer producer;

//    @QueryField(name = "producer.id")
//    @Column(name = "producer_id", updatable = false, insertable = false)
//    public Long producer_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "amount_id")
    public Amount amount;

//    @QueryField(name = "amount.id")
//    @Column(name = "amount_id", updatable = false, insertable = false)
//    public Long amount_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fragrant_id")
    public Fragrant fragrant;

//    @QueryField(name = "fragrant.id")
//    @Column(name = "fragrant_id", updatable = false, insertable = false)
//    public Long fragrant_id;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "product_target")
    private List<Target> targets;


    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY,cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    public List<Version> versions;

    public Product() {
    }

}
