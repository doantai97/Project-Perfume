package com.perfume.entity;

import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@TableName
public class Fragrant extends BaseEntity {

    @QueryField
    public String name;

    @QueryField
    public String description;

    @OneToMany(mappedBy = "fragrant")
    public List<Product> products;

    public Fragrant() {
    }

    public Fragrant(String name, String description, List<Product> products) {
        this.name = name;
        this.description = description;
        this.products = products;
    }
}
