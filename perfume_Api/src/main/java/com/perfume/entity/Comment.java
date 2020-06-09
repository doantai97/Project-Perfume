package com.perfume.entity;


import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@TableName
public class Comment extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    public String content;

    @QueryField
    public String type;

    @QueryField
    public Long postId;

    @ManyToOne
    @JoinColumn(name = "paren_comment_id")
    @QueryField(name = "parenComment.id")
    public Comment parenComment;

    @OneToMany(mappedBy = "parenComment")
    public List<Comment> subComments;

    @ManyToOne
    @JoinColumn(name = "user_id")
    public User user;
}




