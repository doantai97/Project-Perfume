package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.*;
import com.perfume.dto.mapper.CartItemMapper;
import com.perfume.dto.search.CartItemSearch;
import com.perfume.entity.Category;
import com.perfume.entity.CartItem;
import com.perfume.entity.Producer;

import com.perfume.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    CartItemMapper cartItemMapper;

    @PostMapping("")
    public ResponseEntity<ResponseMsg<CartItem>> create(@RequestBody CartItem body) {
        CartItem cartItem = cartItemRepository.findByUserIdAndVersionId(body.getUser().getId(), body.getVersion().getId());
        if (cartItem != null) {
            cartItem.setQuantity(body.getQuantity() == null ? cartItem.getQuantity() + 1 : body.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            if (body.getQuantity() == null) {
                body.setQuantity(1);
            }
            body.setStatus(StatusEnum.ACTIVE.getValue());
            body.setId(null);
            cartItemRepository.save(body);
        }

        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsg<Boolean>> delete(@PathVariable Long id) {
        cartItemRepository.deleteById(id);
        return ResponseEntity.ok(new ResponseMsg<>(true, 200, ""));
    }

    @PutMapping("/{id}/{quantity}")
    public ResponseEntity<ResponseMsg<CartItem>> updateQuantity(@PathVariable Long id, @PathVariable int quantity) {
        CartItem cartItem = new CartItem();
        cartItem.setId(id);
        cartItem.setQuantity(quantity);
        cartItemRepository.update(cartItem);
        return ResponseEntity.ok(new ResponseMsg<>(cartItem, 200, ""));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<CartItemDTO>> filter(@RequestBody CartItemSearch body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<CartItem> cartItems = cartItemRepository.find(body);

        return ResponseEntity.ok(
                cartItems.stream().map(x -> cartItemMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

}
