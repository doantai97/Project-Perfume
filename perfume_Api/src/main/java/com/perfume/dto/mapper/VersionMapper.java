package com.perfume.dto.mapper;

import com.nmhung.mapper.BaseConver;
import com.perfume.dto.VersionDTO;
import com.perfume.entity.Version;

public class VersionMapper extends BaseConver<Version, VersionDTO> {

    @Override
    public VersionDTO toDTO(Version entity) {
        VersionDTO versionDTO = super.toDTO(entity);
//        if(versionDTO.getProduct() != null){
//            versionDTO.getProduct().setVersions(null);
//        }
        return versionDTO;
    }

    @Override
    public Version toEntity(VersionDTO dto) {
        return super.toEntity(dto);
    }
}
