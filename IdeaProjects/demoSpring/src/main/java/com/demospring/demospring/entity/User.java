package com.demospring.demospring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "users5", uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @Column(unique = true)
    private String name;
    @Column(nullable = false)
    @NonNull
    private String password;

    public void setPassword(String p){
        this.password = p;
    }
    public String getPassword(){
        return this.password;
    }

    public String getUsername(){
        return this.name;
    }
}
