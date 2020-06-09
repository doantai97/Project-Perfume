package com.perfume.controller;

import com.perfume.constant.StatusEnum;
import com.perfume.dto.ResponseMsg;
import com.perfume.entity.DisplayStatic;
import com.perfume.repository.DisplayStaticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import javax.transaction.Transactional;

@RestController
@RequestMapping("/api/display-static")
public class DisplayStaticController {
    @Autowired
    DisplayStaticRepository displayStaticRepository;

//
//    @PostMapping("")
//    public ResponseEntity<ResponseMsg<DisplayStatic>> create(@RequestBody DisplayStatic body) {
//        body.setStatus(StatusEnum.ACTIVE.getValue());
//        body.setId(null);
//        displayStaticRepository.save(body);
//        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
//    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsg<DisplayStatic>> update(@RequestBody DisplayStatic body, @PathVariable Long id) {
        body.setStatus(null);
        body.setId(id);
        displayStaticRepository.save(body);
        return ResponseEntity.ok(new ResponseMsg<>(body, 200, ""));
    }

    @GetMapping("")
    public ResponseEntity<List<DisplayStatic>> getAll() {
        return ResponseEntity.ok(displayStaticRepository.findAll());
    }

    @GetMapping("/{type}")
    public ResponseEntity<DisplayStatic> getAll(@PathVariable String type) {
        return ResponseEntity.ok(displayStaticRepository.findByType(type.toUpperCase()));
    }
//    @Transactional
//    @DeleteMapping("/{id}")
//    public ResponseEntity<ResponseMsg<Boolean>> delete(@PathVariable Long id) {
//        displayStaticRepository.changeStatus(id, StatusEnum.DELETED.getValue());
//        return ResponseEntity.ok(new ResponseMsg<>(true, 200, ""));
//    }
}
