package com.perfume.controller;


import com.perfume.constant.CommentType;
import com.perfume.constant.StatusEnum;
import com.perfume.dto.PagingDTO;
import com.perfume.dto.CommentDTO;
import com.perfume.dto.ResponseMsg;
import com.perfume.dto.ResponsePaging;
import com.perfume.dto.mapper.CommentMapper;
import com.perfume.entity.Comment;
import com.perfume.entity.User;
import com.perfume.repository.CommentRepository;
import com.perfume.sercurity.JwtToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/comment")
public class CommentController {
    @Autowired
    CommentRepository commentRepository;

    @Autowired
    CommentMapper commentMapper;

    @Autowired
    JwtToken jwtToken;

    @PostMapping("")
    public ResponseEntity<ResponseMsg<Comment>> create(@RequestBody Comment body, HttpServletRequest request) {
        if (CommentType.find(body.getType()) == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
//        if (body.getPostId() == null) {
//            body.setPostId(0L);
//        }
        User user = jwtToken.getUserLogin(request);
        body.setUser(user);
        body.setStatus(StatusEnum.ACTIVE.getValue());
        body.setId(null);
        commentRepository.save(body);
        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<Comment>> update(@RequestBody Comment body, @PathVariable Long id) {
        body.setId(id);
        commentRepository.update(body);
        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsg<Boolean>> delete(@PathVariable Long id) {
        commentRepository.changeStatus(id, StatusEnum.DELETED.getValue());
        return ResponseEntity.ok(new ResponseMsg<>(true, 200, ""));
    }

    @GetMapping("")
    public ResponseEntity<ResponsePaging<CommentDTO>> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Comment> pagedResult = commentRepository.getAll(paging);
        List<CommentDTO> comments = new ArrayList<>();

        if (pagedResult.hasContent()) {
            comments = pagedResult.getContent().stream().map(commentMapper::toDTO).collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                new ResponsePaging<>(comments, new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset()))
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<CommentDTO> getById(@PathVariable Long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (!comment.isPresent()) {
            throw new ValidationException("category does not exist");
        }
        return ResponseEntity.ok(commentMapper.toDTO(comment.get()));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<CommentDTO>> filter(@RequestBody Comment body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<Comment> comments = commentRepository.find(body);

        return ResponseEntity.ok(
                comments.stream().map(x -> commentMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<CommentDTO>> filterPage(@RequestBody Comment body, @PathVariable int page, @PathVariable int limit) {
        if (body.getStatus() == null) {
            body.setStatus(StatusEnum.ACTIVE.getValue());
        }
        Pageable paging = PageRequest.of(page - 1, limit);


        Page<Comment> pagedResult = commentRepository.findPage(body, paging);
        List<CommentDTO> comments = new ArrayList<>();
        if (pagedResult.hasContent()) {
            comments = pagedResult.getContent().stream().map(commentMapper::toDTO).collect(Collectors.toList());
        }
        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(comments, pagingDTO));
    }


    @GetMapping("/{type}/{postId}/{page}/{limit}")
    public ResponseEntity<ResponsePaging<CommentDTO>> getByPostId(@PathVariable Long postId, @PathVariable String type, @PathVariable int page, @PathVariable int limit) {
        if (CommentType.find(type) == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Comment commentSearch = new Comment();
        commentSearch.setStatus(StatusEnum.ACTIVE.getValue());
        commentSearch.setPostId(postId);
        commentSearch.setType(type);
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Comment> pagedResult = commentRepository.findPage(commentSearch, paging);
        List<CommentDTO> comments = new ArrayList<>();
        if (pagedResult.hasContent()) {
            comments = pagedResult.getContent().stream().map(commentMapper::toDTO).collect(Collectors.toList());
        }
        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(comments, pagingDTO));
    }
}
