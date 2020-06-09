package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.*;
import com.perfume.dto.mapper.TargetMapper;
import com.perfume.entity.Category;
import com.perfume.entity.Target;
import com.perfume.repository.TargetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/target")
public class TargetController {
    @Autowired
    TargetRepository targetRepository;

    @Autowired
    TargetMapper targetMapper;

    @PostMapping("")
    public ResponseEntity<ResponseMsg<Target>> create(@RequestBody Target body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        body.setId(null);
        targetRepository.save(body);
        return ResponseEntity.ok(new ResponseMsg<>(body,200,""));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<Target>> update(@RequestBody Target body, @PathVariable Long id) {
        body.setStatus(null);
        body.setId(id);
        targetRepository.update(body);
        return ResponseEntity.ok(new ResponseMsg<>(body,200,""));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsg<Boolean>> delete(@PathVariable Long id) {
        targetRepository.changeStatus(id, StatusEnum.DELETED.getValue());
        return ResponseEntity.ok(new ResponseMsg<>(true,200,""));
    }

    @GetMapping("")
    public ResponseEntity<ResponsePaging<TargetDTO>> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Target> pagedResult = targetRepository.getAll(paging);
        List<TargetDTO> targets = new ArrayList<>();

        if (pagedResult.hasContent()) {
            targets = pagedResult.getContent().stream().map(targetMapper::toDTO).collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                new ResponsePaging<>(targets, new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset()))
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<TargetDTO> getById(@PathVariable Long id) {
        Optional<Target> target = targetRepository.findById(id);
        if (!target.isPresent()) {
            throw new ValidationException("category does not exist");
        }
        return ResponseEntity.ok(targetMapper.toDTO(target.get()));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<TargetDTO>> filter(@RequestBody Target body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<Target> targets = targetRepository.find(body);

        return ResponseEntity.ok(
                targets.stream().map(x -> targetMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<TargetDTO>> filterPage(@RequestBody Target body, @PathVariable int page, @PathVariable int limit) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Target> pagedResult = targetRepository.findPage(body, paging);
        List<TargetDTO> targets = new ArrayList<>();
        if (pagedResult.hasContent()) {
            targets = pagedResult.getContent().stream().map(targetMapper::toDTO).collect(Collectors.toList());
        }
        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(targets, pagingDTO));
    }
}
