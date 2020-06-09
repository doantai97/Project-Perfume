package com.perfume.dto;

import lombok.Builder;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.HashSet;
import java.util.Set;

@Data
public class TargetDTO {
    private Long id;

    private String name;

    public TargetDTO() {
    }

    public TargetDTO(String name) {

        this.name = name;
    }

    //    private Set<Product> products;


}
