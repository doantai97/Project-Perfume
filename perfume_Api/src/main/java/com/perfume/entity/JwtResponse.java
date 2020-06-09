package com.perfume.entity;

public class JwtResponse {

    private final String token;
    private User user;

    public JwtResponse(String token) {

        this.token = token;

    }

    public JwtResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {

        return this.token;

    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
