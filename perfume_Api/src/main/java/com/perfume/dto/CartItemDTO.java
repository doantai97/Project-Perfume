package com.perfume.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
public class CartItemDTO extends BaseDTO {

    public Long userId;

    public Long versionId;

    public int quantity;

    @JsonIgnore
    public UserDTO user;

    public VersionDTO version;
}
