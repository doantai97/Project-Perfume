package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.PagingDTO;
import com.perfume.dto.CouponDTO;
import com.perfume.dto.ResponseMsg;
import com.perfume.dto.ResponsePaging;
import com.perfume.dto.mapper.CouponMapper;
import com.perfume.entity.Coupon;
import com.perfume.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coupon")
public class CouponController {
    @Autowired
    CouponRepository couponRepository;

    @Autowired
    CouponMapper couponMapper;

    @PostMapping("")
    public ResponseEntity<ResponseMsg<Coupon>> create(@RequestBody Coupon body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        body.setId(null);
        couponRepository.save(body);
        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @PostMapping("/validate/{code}")
    public ResponseEntity<ResponseMsg<Boolean>> validate(@PathVariable String code) {
        Boolean rs = couponRepository.validateCoupon(code);
        Integer status = rs ? 200 : 201;
        return ResponseEntity.status(status).body(null);
//        return ResponseEntity.ok(new ResponseMsg<Boolean>(rs, 200, ""));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<Coupon>> update(@RequestBody Coupon body, @PathVariable Long id) {
        body.setStatus(null);
        body.setId(id);
        couponRepository.update(body);
        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsg<Boolean>> delete(@PathVariable Long id) {
        couponRepository.changeStatus(id, StatusEnum.DELETED.getValue());
        return ResponseEntity.ok(new ResponseMsg<>(true, 200, ""));
    }

    @GetMapping("")
    public ResponseEntity<ResponsePaging<CouponDTO>> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Coupon> pagedResult = couponRepository.getAll(paging);
        List<CouponDTO> coupons = new ArrayList<>();

        if (pagedResult.hasContent()) {
            coupons = pagedResult.getContent().stream().map(couponMapper::toDTO).collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                new ResponsePaging<>(coupons, new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset()))
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<CouponDTO> getById(@PathVariable Long id) {
        Optional<Coupon> coupon = couponRepository.findById(id);
        if (!coupon.isPresent()) {
            throw new ValidationException("category does not exist");
        }
        return ResponseEntity.ok(couponMapper.toDTO(coupon.get()));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<CouponDTO>> filter(@RequestBody Coupon body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<Coupon> coupons = couponRepository.find(body);

        return ResponseEntity.ok(
                coupons.stream().map(x -> couponMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<CouponDTO>> filterPage(@RequestBody Coupon body, @PathVariable int page, @PathVariable int limit) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Coupon> pagedResult = couponRepository.findPage(body, paging);
        List<CouponDTO> coupons = new ArrayList<>();
        if (pagedResult.hasContent()) {
            coupons = pagedResult.getContent().stream().map(couponMapper::toDTO).collect(Collectors.toList());
        }
        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(coupons, pagingDTO));
    }
}
