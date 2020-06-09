package com.perfume.entity;

import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@Entity
@TableName
@EqualsAndHashCode(callSuper = true)
public class Producer extends BaseEntity {
    @QueryField
    public String name;
    @Lob
    @QueryField
    public String description;

    @OneToMany(mappedBy = "producer")
    public List<Product> products;

    public Producer() {
    }

    public Producer(String name, String description, List<Product> products) {
        this.name = name;
        this.description = description;
        this.products = products;
    }
}
