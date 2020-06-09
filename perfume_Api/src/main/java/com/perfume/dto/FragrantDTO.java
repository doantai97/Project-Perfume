package com.perfume.dto;

import lombok.Builder;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Data
public class FragrantDTO {
    private Long id;
    public String name;
    public String description;

    public FragrantDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public FragrantDTO() {
    }

    //    public List<Product> products;
}
