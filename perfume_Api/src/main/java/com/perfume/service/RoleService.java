package com.perfume.service;

import com.perfume.dto.RoleDTO;
import org.springframework.stereotype.Service;

@Service
public interface RoleService {
    public RoleDTO getOne(Long id);
}
