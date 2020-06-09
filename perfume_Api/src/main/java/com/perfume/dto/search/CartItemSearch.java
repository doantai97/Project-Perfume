package com.perfume.dto.search;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.SearchClass;
import com.perfume.entity.User;
import com.perfume.entity.Version;
import lombok.Data;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@SearchClass
public class CartItemSearch {

    @QueryField(id = true)
    private Long id;

    @QueryField
    @JsonIgnore
    private Integer status;

    @QueryField
    public Integer quantity;

    @QueryField(name = "user.id")
    public Long userId;

    @QueryField(name = "version.id")
    public Long versionId;
}
