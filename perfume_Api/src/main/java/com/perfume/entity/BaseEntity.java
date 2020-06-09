package com.perfume.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.Supperclass;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
@Data
@Supperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @QueryField(id = true)
    protected Long id;

    @QueryField
    protected Integer status;
    @QueryField
    @CreatedDate
    protected Date createdAt;


    @QueryField
    @LastModifiedDate
    protected Date updatedAt;


    @CreatedBy
    protected String createdBy;

    @LastModifiedBy
    protected String lastModifiedBy;

    public BaseEntity() {
    }
}
