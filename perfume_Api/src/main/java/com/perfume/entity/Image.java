package com.perfume.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table
public class Image extends BaseEntity {
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String name;
}
