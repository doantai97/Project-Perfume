package com.perfume.entity;


import lombok.Data;

import javax.persistence.*;
import java.util.List;


@Data
@Entity
@Table(name = "ward")
public class Ward {

    @Id
    private Integer id;

    @Column(name = "_name")
    private String name;

    @Column(name = "_prefix")
    private String prefix;

    @Column(name = "_province_id")
    private Integer provinceId;

    @Column(name = "_district_id")
    private Integer districtId;
}
