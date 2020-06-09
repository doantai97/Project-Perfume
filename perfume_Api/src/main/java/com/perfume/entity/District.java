package com.perfume.entity;


import lombok.Data;

import javax.persistence.*;
import java.util.List;


@Data
@Entity
@Table(name = "district")
public class District {
    @Id
    private Integer id;

    @Column(name = "_name")
    private String name;

    @Column(name = "_prefix")
    private String prefix;


    @Column(name = "_province_id")
    private Integer provinceId;


}
