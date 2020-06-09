package com.perfume.controller;

import com.perfume.dto.ImageDTO;
import com.perfume.dto.ResponseMsg;
import com.perfume.entity.Image;
import com.perfume.repository.ImageRepository;
import com.perfume.util.StringUtils;
import com.perfume.util.UploadFileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    @Autowired
    UploadFileUtil uploadFileUtil;

    @Autowired
    ImageRepository imageRepository;

    private final String prefix = "tmp/";

    @GetMapping(value = {"/**/{extension:(?:\\w|\\W)+\\.(?:jpg|bmp|gif|jpeg|png|webp)$}"})
    public ResponseEntity<InputStreamResource> getFileImage(@PathVariable String extension, HttpServletRequest request) throws IOException {
        String restOfTheUrl = (String) request.getAttribute(
                HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);


        String fileName = restOfTheUrl.replaceFirst("/api/storage", "");
        Resource imgFile = uploadFileUtil.loadFileAsResource(fileName);
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(new InputStreamResource(imgFile.getInputStream()));
    }


    @PostMapping("")
    public ResponseEntity<ResponseMsg<Image>> create(@RequestBody Image body) {
        ResponseMsg responseMsg = new ResponseMsg();
        if (body.getUrl() == null || body.getName() == null) {
            responseMsg.setMsg("Vui lòng nhập đầy đủ dữ liệu");
            return ResponseEntity.ok(responseMsg);
        }


        String urlEncode = StringUtils.URLEncode(body.getName());
        String imageUrlCheck = prefix + urlEncode + uploadFileUtil.getExtension(body.getUrl());
        if (imageRepository.existsByUrl(imageUrlCheck)) {
            responseMsg.setMsg("đường dẫn ảnh đã tồn tại");
            return ResponseEntity.ok(responseMsg);
        }
        String imageUrl = uploadFileUtil.upload(body.getUrl(), prefix + urlEncode);
        if (imageUrl.equals("")) {
            responseMsg.setMsg("up ảnh thất bại");
            return ResponseEntity.ok(responseMsg);
        }
        body.setUrl(imageUrl);

        responseMsg.setStatus(200);
        responseMsg.setData(body);
        return ResponseEntity.ok(responseMsg);
    }

//    @PostMapping("/upload")
//    public ResponseEntity<String> create(@RequestBody ImageDTO image) {
//
//        if (image.getUrl() != null) {
//            String imageUrl = upload(image, prefix + image.getUrl());
//            if (imageUrl.equals("")) {
//                return ResponseEntity.badRequest().build();
//            }
//        }
//        return ResponseEntity.ok(responseMsg);
//    }


}
