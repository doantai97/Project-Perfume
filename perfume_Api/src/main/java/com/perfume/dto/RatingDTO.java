package com.perfume.dto;

import lombok.Builder;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
public class RatingDTO extends BaseDTO {
    public int score;

    public Long userId;

    public Long productId;

    public UserDTO user;

//    public ProductDTO product;
}
