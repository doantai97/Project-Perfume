package com.perfume.entity;


import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Data
@TableName
public class News extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    @QueryField
    private String title;

    @Column(columnDefinition = "TEXT")
    @QueryField
    private String content;

    @Column(length = 1024)
    @QueryField
    private String description;

    @Column(columnDefinition = "TEXT")
    @QueryField
    private String url;

    @Column(length = 1024)
    @QueryField
    private String image;

}
