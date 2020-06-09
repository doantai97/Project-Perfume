package com.perfume.dto;

import lombok.Data;

@Data
public class ChartDTO {
    private int label;

    private Double value;

    private int count;

    public ChartDTO() {
    }

    public ChartDTO(int count, Double value, int label) {
        this.label = label;
        this.value = value;
        this.count = count;
    }
}
