package com.perfume.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class ProductDTO extends BaseDTO {
    public String name;
    public String imageBase64;
    public String code;
    public String[] highlights;
    public String gender;
    public Date MFG;
    public Date EXP;
    public String image;
    public String description;
    public Integer year;
    public Integer totalSold;
    public CategoryDTO category = new CategoryDTO();

    public List<VersionDTO> versions = new ArrayList<>();

//    public List<CartItemDTO> cartItems;

    public ProducerDTO producer = new ProducerDTO();


    public AmountDTO amount = new AmountDTO();


    public FragrantDTO fragrant = new FragrantDTO();


    private List<TargetDTO> targets = new ArrayList<>();

    public ProductDTO() {
    }


}
