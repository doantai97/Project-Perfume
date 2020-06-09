package com.perfume.entity;

import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@TableName
@EqualsAndHashCode(callSuper = true)
public class Category extends BaseEntity {
    @QueryField
    public String name;

    @Column(unique=true)
    @QueryField
    public String code;

    @QueryField
    @Lob
    public String description;

    @OneToMany(mappedBy = "category")
    public List<Product> products;

    public Category() {
    }

    public Category(String name, String code, String description, List<Product> products) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.products = products;
    }
}
