package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.CategoryDTO;
import com.perfume.dto.PagingDTO;
import com.perfume.dto.ResponseMsg;
import com.perfume.dto.ResponsePaging;
import com.perfume.dto.mapper.CategoryMapper;
import com.perfume.entity.Category;
import com.perfume.entity.User;
import com.perfume.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/category")
//@CrossOrigin(origins = "*", maxAge = 3600,allowCredentials="true")
public class CategoryController {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    CategoryMapper categoryMapper;

    @PostMapping("")
    public ResponseEntity<ResponseMsg<Category>> create(@RequestBody Category body) {
        if (categoryRepository.existsByCode(body.getCode())) {
            throw new ValidationException("code already existed");
        }
        body.setStatus(StatusEnum.ACTIVE.getValue());
        body.setId(null);
        categoryRepository.save(body);
        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<Category>> update(@RequestBody Category body, @PathVariable Long id) {
        body.setStatus(null);
        body.setId(id);
        categoryRepository.update(body);
        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ResponseMsg<Long>> delete(@PathVariable Long id) {
        categoryRepository.changeStatus(id, StatusEnum.DELETED.getValue());
        return ResponseEntity.ok(new ResponseMsg<>(id, 200, ""));
    }

    @GetMapping("")
    public ResponseEntity<ResponsePaging<CategoryDTO>> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Category> pagedResult = categoryRepository.getAll(paging);
        List<CategoryDTO> categories = new ArrayList<>();

        if (pagedResult.hasContent()) {
            categories = pagedResult.getContent().stream().map(categoryMapper::toDTO).collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                new ResponsePaging<>(categories, new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset()))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getById(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (!category.isPresent()) {
            throw new ValidationException("category does not exist");
        }
        return ResponseEntity.ok(categoryMapper.toDTO(category.get()));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<CategoryDTO>> filter(@RequestBody Category body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<Category> categories = categoryRepository.find(body);

        return ResponseEntity.ok(
                categories.stream().map(x -> categoryMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<CategoryDTO>> filterPage(@RequestBody Category body, @PathVariable int page, @PathVariable int limit) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Category> pagedResult = categoryRepository.findPage(body, paging);
        List<CategoryDTO> categories = new ArrayList<>();
        if (pagedResult.hasContent()) {
            categories = pagedResult.getContent().stream().map(categoryMapper::toDTO).collect(Collectors.toList());
        }
        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(categories, pagingDTO));
    }
}
