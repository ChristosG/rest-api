package com.demospring.demospring.repository;

import com.demospring.demospring.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Product findByName(String name);
    void deleteByName(String name);


    //List<Product> saveProducts(List<Product> products);

}
