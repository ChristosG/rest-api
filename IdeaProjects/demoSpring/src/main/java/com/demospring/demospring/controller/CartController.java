package com.demospring.demospring.controller;

import com.demospring.demospring.entity.Cart;
import com.demospring.demospring.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CartController {

    @Autowired
    private CartService service;

    @PostMapping("/addToCart")
    public Cart addToCart(@RequestBody Cart cart){
        return service.saveCart(cart);
    }

    @GetMapping("/getCart")
    public List<Cart> findAllProducts(){
        return service.getWholeCart();
    }
    @GetMapping("/getUserCart/{name}")
    public List<Cart> getProductsByName(@PathVariable String name) {
        return service.getProductsByName(name);
    }


    @GetMapping("/productOnCart/{id}")
    public Cart findProductById(@PathVariable int id){
        return service.getCartById(id);
    }



    @PutMapping("/updateCart") //quantity
    public Cart updateProduct(@RequestBody Cart cart){
        return service.updateCart(cart);
    }

    @DeleteMapping("/deleteFromCartId/{id}")
    public String deleteCart(@PathVariable int id){
        return service.deleteCart(id);
    }

    @DeleteMapping("/deleteFromCartName/{name}")
    public String deleteCartByName(@PathVariable String name){
        return service.deleteCartByName(name);
    }

    /*@DeleteMapping("/deleteFromCartProductId/{id}")
    public String deleteCartByProductId(@PathVariable String product_id){
        return service.deleteByProduct_id(product_id);
    }*/
}

