package com.demospring.demospring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name="productImages")
public class ProductImages{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @Column
    private String name;

    //@ManyToOne
    //@JoinColumn(name = "product_id")
    private int productId;

    @Column
    private String imageUrl;

}
