package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.PagingDTO;
import com.perfume.dto.ProductDTO;
import com.perfume.dto.ResponseMsg;
import com.perfume.dto.ResponsePaging;
import com.perfume.dto.mapper.ProductMapper;
import com.perfume.dto.search.ProductSearch;
import com.perfume.entity.Product;
import com.perfume.repository.ProductRepository;
import com.perfume.util.UploadFileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;
import java.util.stream.LongStream;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductMapper productMapper;

    @Autowired
    UploadFileUtil uploadFileUtil;

    private final String prefix = "product/";


    @PostMapping("")
    public ResponseEntity<ProductDTO> create(@RequestBody ProductDTO body) {
        if (body.code == null || body.code.equals("")) {
            throw new ValidationException("code required");
        }
        if (productRepository.existsByCode(body.getCode())) {
            throw new ValidationException("code already existed");
        }
        if (body.imageBase64 != null) {
            String imageUrl = uploadFileUtil.upload(body.imageBase64, prefix + body.code);
            if (imageUrl.equals("")) {
                throw new ValidationException("invalid image type for base64");
            }
            body.setImage(imageUrl);
        }

        body.setStatus(StatusEnum.ACTIVE.getValue());
        body.setId(null);
        Product product = productMapper.toEntity(body);
        product.getVersions().forEach(item -> {
            item.setStatus(StatusEnum.ACTIVE.getValue());
            item.setProduct(product);
        });
        setValueProduct(product);
        body = productMapper.toDTO(productRepository.save(product));
        return ResponseEntity.ok(body);
    }

    void setValueProduct(Product product){
        LongStream longStream = product.getVersions().stream().mapToLong(value -> {
            return value.getPrice();
        });
        product.setAvgPrice(longStream.average().getAsDouble());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<ProductDTO>> update(@RequestBody ProductDTO body, @PathVariable Long id) {
        ResponseMsg<ProductDTO> responseMsg = new ResponseMsg<>();
        if (!productRepository.existsById(id)) {
            responseMsg.setMsg("Không tồn tại sản phẩn");
            ResponseEntity.ok(responseMsg);
        }
        body.setId(id);
        if (productRepository.existsByCodeAndIdNot(body.getCode(), body.getId())) {
            responseMsg.setMsg("Trùng URI");
            ResponseEntity.ok(responseMsg);
        }

        if (body.imageBase64 != null) {
            String imageUrl = uploadFileUtil.upload(body.imageBase64, prefix + body.code);
            if (imageUrl.equals("")) {
                throw new ValidationException("invalid image type for base64");
            }
            body.setImage(imageUrl);
        }

        Product product = productMapper.toEntity(body);
        product.getVersions().forEach(item -> {
            if (item.getId() == null) {
                item.setStatus(StatusEnum.ACTIVE.getValue());
            }
            item.setProduct(product);
        });
        product.setStatus(StatusEnum.ACTIVE.getValue());
        setValueProduct(product);
        body = productMapper.toDTO(productRepository.save(product));
        responseMsg.setStatus(200);
        responseMsg.setData(body);
        return ResponseEntity.ok(responseMsg);
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsg> delete(@PathVariable Long id) {
        ProductSearch productSearch = new ProductSearch();
        productSearch.setStatus(StatusEnum.DELETED.getValue());
        productSearch.setId(id);
        productRepository.update(productSearch);
        return ResponseEntity.ok(new ResponseMsg(productSearch, 200, "Delete success"));
    }

    @GetMapping("")
    public ResponseEntity<ResponsePaging<ProductDTO>> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Product> pagedResult = productRepository.getAll(paging);
        List<ProductDTO> products = new ArrayList<>();

        if (pagedResult.hasContent()) {
            products = pagedResult.getContent().stream().map(productMapper::toDTO).collect(Collectors.toList());
        }

        return ResponseEntity.ok(
                new ResponsePaging<>(products, new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset()))
        );
    }

    @GetMapping("/{code}")
    public ResponseEntity<ResponseMsg<ProductDTO>> findByCode(@PathVariable String code) {
        ResponseMsg<ProductDTO> responseMsg = new ResponseMsg<ProductDTO>();
        ProductSearch productSearch = new ProductSearch();
        productSearch.setCode(code);

        List<Product> products = productRepository.find(productSearch);
        if (products.size() > 0) {
            responseMsg.setStatus(200);
            responseMsg.setData(productMapper.toDTO(products.get(0)));
        }
        return ResponseEntity.ok(responseMsg);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (!product.isPresent()) {
            throw new ValidationException("category does not exist");
        }
        return ResponseEntity.ok(productMapper.toDTO(product.get()));
    }

    // end crud

    @PostMapping("/filter")
    public ResponseEntity<List<ProductDTO>> filter(@RequestBody ProductSearch body) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        List<Product> products = productRepository.find(body);

        return ResponseEntity.ok(
                products.stream().map(x -> productMapper.toDTO(x)).collect(Collectors.toList())
        );
    }

    @PostMapping("/filter/{page}/{limit}")
    public ResponseEntity<ResponsePaging<ProductDTO>> filterPage(@RequestBody ProductSearch body, @PathVariable int page, @PathVariable int limit) {
        body.setStatus(StatusEnum.ACTIVE.getValue());
        Pageable paging = PageRequest.of(page - 1, limit);
        Page<Product> pagedResult = productRepository.findPage(body, paging);
        List<ProductDTO> products = new ArrayList<>();
        if (pagedResult.hasContent()) {
            products = pagedResult.getContent().stream().map(productMapper::toDTO).collect(Collectors.toList());
        }


        PagingDTO pagingDTO = new PagingDTO(pagedResult.getTotalElements(), page, limit, paging.getOffset());
        return ResponseEntity.ok(new ResponsePaging<>(products, pagingDTO));
    }


//    @GetMapping("/image/{fileName:.+}")
//    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws IOException {
//        Resource imgFile = uploadFileUtil.loadFileAsResource(fileName);
//
//        return ResponseEntity
//                .ok()
//                .contentType(MediaType.IMAGE_JPEG)
//                .body(new InputStreamResource(imgFile.getInputStream()));
//    }
}
