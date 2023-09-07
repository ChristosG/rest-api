package com.demospring.demospring.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name="products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @NonNull
    @Column(unique = true)
    private String name;
   // private String imageUrl;
    @NonNull
    private double price;
    @Nullable
    private String info;
    @NonNull
    private int availableQuantity;

    /*@OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ProductImages> productImages = new ArrayList<>();
    */
}
