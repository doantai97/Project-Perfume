package com.perfume.config;

import com.perfume.entity.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {

        String username = "system";
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.of(username);
            }
            if(authentication.getPrincipal() instanceof  UserDetails ){
                username = ((UserDetails) authentication.getPrincipal()).getUsername();
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return Optional.of(username);
    }
}
