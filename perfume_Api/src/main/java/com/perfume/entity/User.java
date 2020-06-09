package com.perfume.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

import java.util.List;

@Entity
@TableName
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {
    @Column(unique = true)
    @QueryField
    public String username;
    @QueryField
    public String firstname;
    @QueryField
    public String lastname;
    @QueryField
    public String email;
    @QueryField
    public String address;
    @QueryField
    public String phone;
    @JsonIgnore
    public String password;

    @QueryField
    public String image;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role")
    public List<Role> roles;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    public List<CartItem> cartItems;

    public User() {
    }

    public User(String username, String firstname, String lastname, String email, String address, String phone, String password, List<Role> roles, List<CartItem> cartItems) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.password = password;
        this.roles = roles;
        this.cartItems = cartItems;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }
}
