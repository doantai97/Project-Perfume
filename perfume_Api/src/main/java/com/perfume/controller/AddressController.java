package com.perfume.controller;


import com.perfume.dto.AddressDTO;
import com.perfume.entity.District;
import com.perfume.entity.Province;
import com.perfume.entity.Ward;
import com.perfume.repository.DistrictRepository;
import com.perfume.repository.ProvinceRepository;
import com.perfume.repository.WardRepository;
import com.perfume.util.MailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    ProvinceRepository provinceRepository;

    @Autowired
    DistrictRepository districtRepository;

    @Autowired
    WardRepository wardRepository;

    @Autowired
    MailUtils mailUtils;

    @GetMapping("/province")
    ResponseEntity<List<Province>> findByProvince() {
        return ResponseEntity.ok(provinceRepository.findAll());
    }

    @GetMapping("/district/{provinceId}")
    ResponseEntity<List<District>> findByDistrict(@PathVariable Integer provinceId) {
        return ResponseEntity.ok(districtRepository.findByProvinceId(provinceId));
    }

    @GetMapping("/ward/{districtId}")
    ResponseEntity<List<Ward>> findByWard(@PathVariable Integer districtId) {
        return ResponseEntity.ok(wardRepository.findByDistrictId(districtId));
    }

    @GetMapping("/{wardId}")
    ResponseEntity<AddressDTO> find(@PathVariable Integer wardId){
        Ward ward = wardRepository.findById(wardId).get();
        District district = districtRepository.findById(ward.getDistrictId()).get();
        Province province = provinceRepository.findById(district.getProvinceId()).get();
        return ResponseEntity.ok(new AddressDTO(province,district,ward));
    }
}
