package com.perfume.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;


@Data
public class RoleDTO {
    public Long id;

    public String name;

//    @JsonIgnore
//    public List<UserDTO> users;
}
