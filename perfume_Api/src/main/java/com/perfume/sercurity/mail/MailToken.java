package com.perfume.sercurity.mail;

import com.perfume.entity.User;
import com.perfume.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class MailToken {
    private static final long serialVersionUID = -2550185165626007488L;

    public static final long JWT_TOKEN_VALIDITY = 24 * 60;

    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    UserRepository userRepository;

    public String getDataFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);

    }


    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {

        final Claims claims = getAllClaimsFromToken(token);

        return claimsResolver.apply(claims);

    }


    private Claims getAllClaimsFromToken(String token) {

        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();

    }

//    public User getUserLogin(HttpServletRequest request){
//        final String requestTokenHeader = request.getHeader("Authorization");
//        String jwtToken = requestTokenHeader.substring(7);
//        String data = this.getDataFromToken(jwtToken);
//
////        return userRepository.findByUsername(username);
//
//    }


    private Boolean isTokenExpired(String token) {

        final Date expiration = getExpirationDateFromToken(token);

        return expiration.before(new Date());

    }


    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();

        return doGenerateToken(claims, userDetails.getUsername());

    }


    private String doGenerateToken(Map<String, Object> claims, String subject) {

        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))

                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))

                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }


//    public Boolean validateToken(String token, UserDetails userDetails) {
//
//        final String username = getUsernameFromToken(token);
//
//        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//
//    }
}
