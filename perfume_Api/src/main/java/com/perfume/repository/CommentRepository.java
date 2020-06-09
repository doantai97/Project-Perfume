package com.perfume.repository;


import com.perfume.entity.Comment;
import com.perfume.repository.custom.CommentRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends  JpaRepository<Comment, Long>, CommentRepositoryCustom {
}
