package com.perfume.controller;

import com.perfume.constant.CheckoutStatus;
import com.perfume.dto.*;
import com.perfume.dto.mapper.CheckoutMapper;
import com.perfume.entity.*;
import com.perfume.repository.*;
import com.perfume.sercurity.JwtToken;
import com.perfume.util.MailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.persistence.Tuple;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    CheckoutRepository checkoutRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CheckoutItemRepository checkoutItemRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CartItemRepository cartItemRepository;


    @Autowired
    private JwtToken jwtToken;

    @Autowired
    private CheckoutMapper checkoutMapper;

    @Autowired
    MailUtils mailUtils;

    @Autowired
    CouponRepository couponRepository;

    @Autowired
    VersionRepository versionRepository;


//    @PutMapping("/delivery/{id}")
//    public ResponseEntity<ResponseMsg<Object>> changeStatusDelivery(@PathVariable Long id) {
//        return changeStatus(id, CheckoutStatus.DELIVERY, null);
//    }
//
//    @PutMapping("/done/{id}")
//    public ResponseEntity<ResponseMsg<Object>> changeStatusDone(@PathVariable Long id) {
//        return changeStatus(id, CheckoutStatus.DONE, null);
//    }
//
//    @PutMapping("/deleted/{id}")
//    public ResponseEntity<ResponseMsg<Object>> changeStatusDeleted(@PathVariable Long id, @RequestParam String node) {
//        System.out.println(node);
//        return changeStatus(id, CheckoutStatus.DELETED, node);
//    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<Object>> update(@PathVariable Long id, @RequestBody Checkout body) {
        body.setId(id);
        boolean rs = false;
        if (body.getStatus() != null) {
            Checkout tmp = checkoutRepository.getOne(id);
            tmp.setStatus(body.getStatus());
            if (tmp.getStatus() == CheckoutStatus.DELETED.getValue()) {
                tmp.setNote(body.getNote());
            }

            tmp = checkoutRepository.save(tmp);
            if (tmp.getStatus() == CheckoutStatus.DONE.getValue()) {
                this.updateTotalSold(tmp.getCheckoutItems());
            }
            if (tmp != null) {
                mailUtils.send(tmp);
            }
            rs = tmp != null;
        } else {
            rs = checkoutRepository.update(body);

        }
        int statusRs = rs ? 200 : 400;
        return ResponseEntity.ok(new ResponseMsg(null, statusRs, null));
    }


    private ResponseEntity<ResponseMsg<Object>> changeStatus(Long id, CheckoutStatus status, String node) {
        Checkout checkout = new Checkout();
        checkout.setStatus(status.getValue());
        checkout.setId(id);
        if (status == CheckoutStatus.DELETED) {
            checkout.setNote(node);
        }
        boolean rs = checkoutRepository.update(checkout);
        int statusRs = rs ? 200 : 400;
        return ResponseEntity.ok(new ResponseMsg(null, statusRs, null));
    }

    @PostMapping("")
    public ResponseEntity<ResponseMsg<Checkout>> checkout(@RequestBody Checkout checkout, HttpServletRequest request) {
        ResponseMsg<Checkout> responseMsg = new ResponseMsg<>(null, 200, "");

        if (checkout.getCoupon() != null) {
            String codeCoupon = checkout.getCoupon().getCode();
            if (codeCoupon == null) {
                checkout.setCoupon(null);
            } else {
                Coupon coupon = couponRepository.getByCodeValidate(codeCoupon);
                if (coupon == null) {
                    responseMsg.setStatus(400);
                    responseMsg.setMsg("Mã giảm giá đã được sử dụng hoặc hết hạn");
                    return ResponseEntity.ok(responseMsg);
                } else {
                    checkout.setCoupon(coupon);
                    coupon.setTotal(coupon.getTotal() - 1);
                    couponRepository.save(coupon);
                }
            }
        }
        User user = jwtToken.getUserLogin(request);


        List<CartItem> carts = user.getCartItems();
        if (carts.size() > 0) {

            checkout.setId(null);
            checkout.setStatus(CheckoutStatus.ACTIVE.getValue());


            List<CheckoutItem> checkoutItems = carts.stream().map(cartItem -> {
                CheckoutItem checkoutItem = new CheckoutItem(cartItem.getQuantity(), cartItem.getVersion(), checkout);
                return checkoutItem;
            }).collect(Collectors.toList());
            checkout.setCheckoutItems(checkoutItems);
            checkout.setUser(user);
            Checkout tmp = checkoutRepository.save(checkout);
            if (tmp != null) {
                mailUtils.send(tmp);

                cartItemRepository.deleteAll(carts);

//                this.updateTotalSold(checkoutItems);
            } else {
                responseMsg.setStatus(400);
                responseMsg.setMsg("checkout thất bại");
            }
            System.out.println();

        } else {
            responseMsg.setStatus(300);
            responseMsg.setMsg("Giỏ hàng không có hàng");
        }
        return ResponseEntity.status(responseMsg.getStatus()).body(responseMsg);
    }


    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<CheckoutDTO>> filterPage(@RequestBody Checkout body, @PathVariable int page, @PathVariable int limit) {
//        body.setStatus(StatusEnum.ACTIVE.getValue());
        Pageable paging = PageRequest.of(page - 1, limit);

        Page<Checkout> pagedResult = checkoutRepository.findPage(body, paging);

        List<CheckoutDTO> producers = new ArrayList<>();

        if (pagedResult.hasContent()) {
            producers = pagedResult.getContent().stream().map(checkoutMapper::toDTO).collect(Collectors.toList());
        }

        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(producers, pagingDTO));
    }

    @GetMapping("/chart")
    public ResponseEntity<List<ChartDTO>> getChart(@RequestParam MultiValueMap<String, String> map) {
        List<Tuple> dtos = checkoutRepository.getChart(map);
        List<ChartDTO> chartDTOList = new ArrayList<>();
        if (Objects.requireNonNull(map.getFirst("type")).equalsIgnoreCase("week")) {
            int j = 0;
            for (int i = 0; i < dtos.size(); i++) {
                while (j < 7) {
                    if (Integer.parseInt(dtos.get(i).get("label").toString()) == j) {
                        ChartDTO chartDTO = new ChartDTO(
                                Integer.parseInt(dtos.get(i).get("count").toString()),
                                Double.parseDouble(dtos.get(i).get("value").toString()),
                                Integer.parseInt(dtos.get(i).get("label").toString())
                        );
                        chartDTOList.add(chartDTO);
                        j++;
                        if (i != dtos.size() - 1) break;
                    } else if (j < Integer.parseInt(dtos.get(i).get("label").toString()) || i == dtos.size() - 1) {
                        ChartDTO chartDTO = new ChartDTO(0, (double) 0, j);
                        chartDTOList.add(chartDTO);
                        j++;
                    }
                }
            }
        }
        if (Objects.requireNonNull(map.getFirst("type")).equalsIgnoreCase("month")) {
            int j = 1;
            for (int i = 0; i < dtos.size(); i++) {
                while (j < 13) {
                    if (Integer.parseInt(dtos.get(i).get("label").toString()) == j) {
                        ChartDTO chartDTO = new ChartDTO(
                                Integer.parseInt(dtos.get(i).get("count").toString()),
                                Double.parseDouble(dtos.get(i).get("value").toString()),
                                Integer.parseInt(dtos.get(i).get("label").toString())
                        );
                        chartDTOList.add(chartDTO);
                        j++;
                        if (i != dtos.size() - 1) break;
                    } else if (j < Integer.parseInt(dtos.get(i).get("label").toString()) || i == dtos.size() - 1) {
                        ChartDTO chartDTO = new ChartDTO(0, (double) 0, j);
                        chartDTOList.add(chartDTO);
                        j++;
                    }
                }
            }
        }
        return ResponseEntity.ok().body(chartDTOList);
    }

    private void updateTotalSold(List<CheckoutItem> checkoutItems) {
        Map<Long, Integer> data = new HashMap<>();
        List<Version> versions = new ArrayList<>();
        checkoutItems.forEach(item -> {

            Version version = versionRepository.findById(item.getVersion().getId()).get();
            Integer totalSoldVersion = version.getTotalSold();
            totalSoldVersion = totalSoldVersion == null ? 0 : totalSoldVersion;


            Long idProduct = version.getProduct().getId();
            Integer quantity = item.quantity;

            if (data.containsKey(idProduct)) {
                quantity += data.get(idProduct);
            }

            data.put(idProduct, quantity);


            //update total version
            version.setTotalSold(totalSoldVersion + item.quantity);
            versionRepository.save(version);
        });


        List<Product> list = productRepository.findAllById(data.keySet());
        list.forEach(item -> {
            Integer totalSold = item.getTotalSold();
            if (totalSold == null) {
                totalSold = 0;
            }
            totalSold += data.get(item.getId());
            item.setTotalSold(totalSold);
        });
        productRepository.saveAll(list);

    }

}
