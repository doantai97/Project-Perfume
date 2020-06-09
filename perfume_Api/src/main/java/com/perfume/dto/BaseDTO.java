package com.perfume.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.Supperclass;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.util.Date;


@Data
public class BaseDTO {
    private Long id;
//    @JsonIgnore
    private Integer status;
    private Date createdAt;
    private Date updatedAt;

    protected String createdBy;

    protected String lastModifiedBy;
}
