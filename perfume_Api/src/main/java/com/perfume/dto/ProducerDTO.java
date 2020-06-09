package com.perfume.dto;

import lombok.Builder;
import lombok.Data;



@Data
public class ProducerDTO{
    private Long id;
    public String name;
    public String description;

//    public List<Product> products;


    public ProducerDTO() {
    }

    public ProducerDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
