package com.perfume.repository;

import com.perfume.entity.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, String> {
    ConfirmationToken findByConfirmationToken(String confirmationToken);

    ConfirmationToken findByConfirmationTokenAndStatus(String confirmationToken, int status);
}
