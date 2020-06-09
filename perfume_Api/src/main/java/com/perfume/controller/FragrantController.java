package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.PagingDTO;
import com.perfume.dto.FragrantDTO;
import com.perfume.dto.ResponseMsg;
import com.perfume.dto.ResponsePaging;
import com.perfume.dto.mapper.FragrantMapper;
import com.perfume.entity.Fragrant;
import com.perfume.repository.FragrantRepository;
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
@RequestMapping("/api/fragrant")
public class FragrantController {
    @Autowired
    FragrantRepository fragrantRepository;

    @Autowired
    FragrantMapper fragrantMapper;

    @PostMapping("")
    public ResponseEntity<ResponseMsg<Fragrant>> create(@RequestBody Fragrant body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        body.setId(null);
        fragrantRepository.save(body);
        return ResponseEntity.ok(new ResponseMsg<>(body,200,""));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<Fragrant>> update(@RequestBody Fragrant body, @PathVariable Long id) {
        body.setStatus(null);
        body.setId(id);
        fragrantRepository.update(body);
        return ResponseEntity.ok(new ResponseMsg<>(body,200,""));
    }
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsg<Boolean>> delete(@PathVariable Long id) {
        fragrantRepository.changeStatus(id, StatusEnum.DELETED.getValue());
        return ResponseEntity.ok(new ResponseMsg<>(true,200,""));
    }

    @GetMapping("")
    public ResponseEntity<ResponsePaging<FragrantDTO>> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Fragrant> pagedResult = fragrantRepository.getAll(paging);
        List<FragrantDTO> fragrants = new ArrayList<>();

        if (pagedResult.hasContent()) {
            fragrants = pagedResult.getContent().stream().map(fragrantMapper::toDTO).collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                new ResponsePaging<>(fragrants, new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset()))
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<FragrantDTO> getById(@PathVariable Long id) {
        Optional<Fragrant> fragrant = fragrantRepository.findById(id);
        if (!fragrant.isPresent()) {
            throw new ValidationException("category does not exist");
        }
        return ResponseEntity.ok(fragrantMapper.toDTO(fragrant.get()));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<FragrantDTO>> filter(@RequestBody Fragrant body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<Fragrant> fragrants = fragrantRepository.find(body);

        return ResponseEntity.ok(
                fragrants.stream().map(x -> fragrantMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<FragrantDTO>> filterPage(@RequestBody Fragrant body, @PathVariable int page, @PathVariable int limit) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Fragrant> pagedResult = fragrantRepository.findPage(body, paging);
        List<FragrantDTO> fragrants = new ArrayList<>();
        if (pagedResult.hasContent()) {
            fragrants = pagedResult.getContent().stream().map(fragrantMapper::toDTO).collect(Collectors.toList());
        }
        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(fragrants, pagingDTO));
    }
}
