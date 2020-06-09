package com.perfume.dto.mapper;

import com.nmhung.mapper.BaseConver;
import com.perfume.dto.UserDTO;
import com.perfume.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper  extends BaseConver<User, UserDTO> {
}
