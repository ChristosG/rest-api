package com.demospring.demospring.service;

import com.demospring.demospring.entity.Cart;
import com.demospring.demospring.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class CartService {
    @Autowired
    private CartRepository repository;

    public Cart saveCart(Cart cart){
        return repository.save(cart);
    }
    @Transactional
    public List<Cart> getProductsByName(String itemName) {
        return repository.findByName(itemName);
    }


    public List<Cart> getWholeCart(){
        return repository.findAll();
    }
    public Cart getCartById(int id){
        return repository.findById(id).orElse(null);
    }

    public String deleteCart(int id){
        repository.deleteById(id);
        return "removed product: " + id;
    }

    @Transactional
    public String deleteCartByName(String name){
        repository.deleteByName(name);
        return "removed product: " + name;
    }
    /*@Transactional
    public String deleteByProduct_id(String product_id){
        repository.deleteByProduct_id(product_id);
        return "removed product: " + product_id;
    }*/
    public Cart updateCart(Cart cart){
        Cart existingProduct=repository.findById(cart.getId()).orElse(null);
        existingProduct.setName(cart.getName());
        existingProduct.setQuantity(cart.getQuantity());
        existingProduct.setProduct_id(cart.getProduct_id()); //need?

        return repository.save(existingProduct);
    }
}
