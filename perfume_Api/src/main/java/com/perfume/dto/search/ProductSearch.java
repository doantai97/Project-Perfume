package com.perfume.dto.search;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.SearchClass;
import com.perfume.dto.OderBy;
import lombok.Data;

import java.util.Date;

@Data
@SearchClass
public class ProductSearch {

    @QueryField(id = true)
    private Long id;

    @QueryField
    @JsonIgnore
    private Integer status;

    public String name;

    @QueryField
    public String code;

    @QueryField
    public Date MFG;
    @QueryField
    public Date EXP;
    @QueryField
    public String image;
    @QueryField
    public String description;

    @QueryField
    public Integer year;

    @QueryField(name = "category.id")
    public Long categoryId;

    @QueryField(name = "producer.id")
    public Long producerId;

    @QueryField(name = "amount.id")
    public Long amountId;


    @QueryField(name = "fragrant.id")
    public Long fragrantId;

    private Long minPrice;

    private Long maxPrice;

    private String categoryCode;

    public String[] highlights;

    public Long versionId;

    public OderBy oderBy;

    public Long[] targetIds;

    private String search;
}
