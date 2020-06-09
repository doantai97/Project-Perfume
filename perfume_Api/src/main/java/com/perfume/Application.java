package com.perfume;

import com.perfume.constant.RoleEnum;
import com.perfume.constant.StatusEnum;
import com.perfume.constant.TargetEnum;
import com.perfume.dto.mapper.UserMapper;
import com.perfume.dto.search.ProductSearch;
import com.perfume.entity.*;
import com.perfume.repository.*;
import com.perfume.util.MailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;
import javax.mail.MessagingException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;


@SpringBootApplication(scanBasePackages = "com.perfume")
public class Application implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    TargetRepository targetRepository;
    @Autowired
    UserMapper userMapper;

    @Autowired
    ProductRepository productRepository;


    @Autowired
    MailUtils mailUtils;

    @Autowired
    DisplayStaticRepository displayStaticRepository;


    @Override
    public void run(String... args) throws Exception {
//        ProductSearch productSearch = new ProductSearch();

//        List<Product> products = productRepository.find(productSearch);


        System.out.println();
//        addDataDefulat();
    }

    public void addDataDefulat() {
        // Khi chương trình chạy
//         Insert vào csdl một user.
        User user = new User();
        user.setUsername("admin");
        user.setPassword(new BCryptPasswordEncoder().encode("123456"));
        user.setAddress("Hà nội");
        user.setEmail("admin@gmail.com");
        user.setFirstname("admin");
        user.setFirstname("admin");
        user.setStatus(StatusEnum.ACTIVE.getValue());

        List<Target> targets = Arrays.asList(

                new Target(TargetEnum.MALE.getValue(), StatusEnum.ACTIVE.getValue()),
                new Target(TargetEnum.FEMALE.getValue(), StatusEnum.ACTIVE.getValue()),
                new Target(TargetEnum.GAY.getValue(), StatusEnum.ACTIVE.getValue()),
                new Target(TargetEnum.LES.getValue(), StatusEnum.ACTIVE.getValue()),
                new Target(TargetEnum.CAR.getValue(), StatusEnum.ACTIVE.getValue())
        );

        for (Target target :
                targets) {
            if (targetRepository.findByName(target.getName()) == null) {
                targetRepository.save(target);
            }
        }

        List<Role> roles = Arrays.asList(
                new Role(RoleEnum.ROLE_ADMIN.toString(), Arrays.asList(user)),
                new Role(RoleEnum.ROLE_EMPLOYEE.toString(), Arrays.asList(user)),
                new Role(RoleEnum.ROLE_MEMBER.toString(), Arrays.asList(user))
        );
        for (int i = 0; i < roles.size(); ++i) {
            if (roleRepository.findByName(roles.get(i).getName()) == null) {
                roleRepository.save(roles.get(i));
            }
        }

        if (userRepository.findByUsername(user.getUsername()) == null) {
            user.setRoles(roleRepository.findAll());
            userRepository.save(user);
        }

        addDisplayStatic();
    }

    public void sendMail() {
        Checkout checkout = new Checkout();
        checkout.setEmail("thangndph05449@gmail.com");
        checkout.setAddress("hdz");
        checkout.setFirstname("HDZ");
        checkout.setLastname("ahihi");

        mailUtils.send(checkout);

    }


    //    @PostConstruct
    public void addDisplayStatic() {
        for (DisplayStatic.DisplayStaticType displayStaticType : DisplayStatic.DisplayStaticType.values()) {
            if (!displayStaticRepository.existsByType(displayStaticType.value())) {
                DisplayStatic displayStatic = new DisplayStatic();
                displayStatic.setContent("");
                displayStatic.setType(displayStaticType.value());
                displayStaticRepository.save(displayStatic);
            }
        }
    }


}
