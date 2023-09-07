package com.demospring.demospring.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name="userDetails")
public class UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @NonNull
    @Column(unique = true)
    private int userId;
    @Nullable
    private LocalDate birthdate;
    @Nullable
    private String email;

    @Nullable
    @Column
    private String address1;
    @Nullable
    @Column
    private String address2;
    @Nullable
    @Column
    private String city;
    @Nullable
    @Column
    private String tk;



}
