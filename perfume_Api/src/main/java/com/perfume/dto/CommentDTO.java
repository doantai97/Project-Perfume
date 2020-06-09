package com.perfume.dto;

import lombok.Data;

import java.util.*;

@Data
public class CommentDTO extends BaseDTO {

    public String content;

    public String type;

    public Long postId;

    public List<CommentDTO> subComments;

    public UserDTO user;
}
