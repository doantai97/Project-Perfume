package com.perfume.dto;

import com.perfume.entity.District;
import com.perfume.entity.Province;
import com.perfume.entity.Ward;
import lombok.Data;

@Data
public class AddressDTO {
    private Province province;
    private District district;
    private Ward ward;

    public AddressDTO(Province province, District district, Ward ward) {
        this.province = province;
        this.district = district;
        this.ward = ward;
    }
}
