package com.perfume.dto;

import lombok.Data;

@Data
public class NewsDTO extends BaseDTO {
    private String title;
    private String content;
    private String url;
    private String description;
    private String image;
}
