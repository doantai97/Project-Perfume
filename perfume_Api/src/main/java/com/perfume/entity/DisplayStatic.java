package com.perfume.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;


@Entity
@Table
@Data
public class DisplayStatic extends BaseEntity {
    private String type;

    @Column(columnDefinition = "TEXT")
    private String content;

    public enum DisplayStaticType {
        ABOUT("ABOUT");
        String _value;

        DisplayStaticType(String value) {
            _value = value;
        }

        public String value() {
            return _value;
        }
    }

}
