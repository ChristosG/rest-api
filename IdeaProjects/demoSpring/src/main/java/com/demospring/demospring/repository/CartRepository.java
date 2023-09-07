package com.demospring.demospring.repository;

import com.demospring.demospring.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    //Cart findByName(String name);
    void deleteByName(String name);
    List<Cart> findByName(String itemName);

    //void deleteByProduct_id(String product_id);
    //List<Product> saveProducts(List<Product> products);

}
