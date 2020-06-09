package com.perfume.entity;


import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "province")
public class Province {
    @Id
    private Integer id;

    @Column(name = "_name")
    private String name;

    @Column(name = "_code")
    private String code;


}
