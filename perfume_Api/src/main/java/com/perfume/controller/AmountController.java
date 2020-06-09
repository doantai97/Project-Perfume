package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.PagingDTO;
import com.perfume.dto.AmountDTO;
import com.perfume.dto.ResponseMsg;
import com.perfume.dto.ResponsePaging;
import com.perfume.dto.mapper.AmountMapper;
import com.perfume.entity.Amount;
import com.perfume.repository.AmountRepository;
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
@RequestMapping("/api/amount")
public class AmountController {
    @Autowired
    AmountRepository amountRepository;

    @Autowired
    AmountMapper amountMapper;

    @PostMapping("")
    public ResponseEntity<ResponseMsg<Amount>> create(@RequestBody Amount body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        body.setId(null);
        amountRepository.save(body);
        return ResponseEntity.ok(new ResponseMsg<>(body,200,""));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<Amount>> update(@RequestBody Amount body, @PathVariable Long id) {
        body.setStatus(null);
        body.setId(id);
        amountRepository.update(body);
        return ResponseEntity.ok(new ResponseMsg<>(body,200,""));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsg<Boolean>> delete(@PathVariable Long id) {
        amountRepository.changeStatus(id, StatusEnum.DELETED.getValue());
        return ResponseEntity.ok(new ResponseMsg<>(true,200,""));
    }

    @GetMapping("")
    public ResponseEntity<ResponsePaging<AmountDTO>> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Amount> pagedResult = amountRepository.getAll(paging);
        List<AmountDTO> amounts = new ArrayList<>();

        if (pagedResult.hasContent()) {
            amounts = pagedResult.getContent().stream().map(amountMapper::toDTO).collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                new ResponsePaging<>(amounts, new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset()))
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<AmountDTO> getById(@PathVariable Long id) {
        Optional<Amount> amount = amountRepository.findById(id);
        if (!amount.isPresent()) {
            throw new ValidationException("category does not exist");
        }
        return ResponseEntity.ok(amountMapper.toDTO(amount.get()));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<AmountDTO>> filter(@RequestBody Amount body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<Amount> amounts = amountRepository.find(body);

        return ResponseEntity.ok(
                amounts.stream().map(x -> amountMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<AmountDTO>> filterPage(@RequestBody Amount body, @PathVariable int page, @PathVariable int limit) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Amount> pagedResult = amountRepository.findPage(body, paging);
        List<AmountDTO> amounts = new ArrayList<>();
        if (pagedResult.hasContent()) {
            amounts = pagedResult.getContent().stream().map(amountMapper::toDTO).collect(Collectors.toList());
        }
        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(amounts, pagingDTO));
    }
}
