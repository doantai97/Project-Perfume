package com.perfume;

import com.perfume.constant.RoleEnum;
import com.perfume.constant.StatusEnum;
import com.perfume.entity.Role;
import com.perfume.entity.User;
import com.perfume.repository.RoleRepository;
import com.perfume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DBSeed {
//    private final String MEMBER = "Test";
//    private final String ADMIN  = "Admin";
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    RoleRepository roleRepository;
//
//    @EventListener
//    public void seed(ContextRefreshedEvent event) {
//        seedRolesTable();
//        seedUsersTable();
//    }
//
//    private void seedRolesTable() {
//
//    }
//
//    private void seedUsersTable() {
//        User testUser = userRepository.findByUsername(MEMBER);
//        User admin = userRepository.findByUsername(ADMIN);
//        if (testUser == null) {
//            User user = new User();
//            Role role = roleRepository.findByName(RoleEnum.ROLE_MEMBER.toString());
//            role.builder().users(Collections.singletonList(user)).build();
//            List<Role> roles = new ArrayList<>();
//            roles.add(role);
//            user.builder()
//                    .username(MEMBER)
//                    .password(new BCryptPasswordEncoder().encode("123456"))
//                    .roles(roles)
//                    .build();
//            userRepository.save(user);
//        }
//        if (admin == null) {
//            User user = new User();
//            List<Role> roles = roleRepository.findAll();
//            for (Role role:
//                 roles) {
//                role.setUsers(Collections.singletonList(user));
//            }
//        }
//    }

    public static void main(String[] args) {


        String input = "&#xa9;";
        System.out.println(toHex(input));
    }

    public static String toHex(String arg) {
        return String.format("%040x", new BigInteger(1, arg.getBytes(/*YOUR_CHARSET?*/)));
    }

    public static String convertStringToHex(String str) {

        StringBuffer hex = new StringBuffer();

        // loop chars one by one
        for (char temp : str.toCharArray()) {

            // convert char to int, for char `a` decimal 97
            int decimal = (int) temp;

            // convert int to hex, for decimal 97 hex 61
            hex.append(Integer.toHexString(decimal));
        }

        return hex.toString();

    }

    // Hex -> Decimal -> Char
    public static String convertHexToString(String hex) {

        StringBuilder result = new StringBuilder();

        // split into two chars per loop, hex, 0A, 0B, 0C...
        for (int i = 0; i < hex.length() - 1; i += 2) {

            String tempInHex = hex.substring(i, (i + 2));

            //convert hex to decimal
            int decimal = Integer.parseInt(tempInHex, 16);

            // convert the decimal to char
            result.append((char) decimal);

        }

        return result.toString();

    }
}
