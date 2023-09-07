package com.demospring.demospring.service;
import org.springframework.transaction.annotation.Transactional;

import com.demospring.demospring.entity.Product;
import com.demospring.demospring.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;


    public Product saveProduct(Product product){
        return repository.save(product);
    }

    public List<Product> saveProducts(List<Product> products){
        return repository.saveAll(products);
    }
    @Transactional
    public Product getProductByName(String name){
        return repository.findByName(name);
    }
    public List<Product> getProducts(){
        return repository.findAll();
    }
    public Product getProductById(int id){
        return repository.findById(id).orElse(null);
    }

    public String deleteProduct(int id){
        repository.deleteById(id);
        return "removed product: " + id;
    }
    @Transactional
    public String deleteProductByName(String name){
        repository.deleteByName(name);
        return "removed product: " + name;
    }
    public Product updateProduct(Product product){
        Product existingProduct=repository.findById(product.getId()).orElse(null);
        existingProduct.setName(product.getName());
        existingProduct.setInfo(product.getInfo());
        existingProduct.setPrice(product.getPrice());
        //existingProduct.setImageUrl(product.getImageUrl());
        return repository.save(existingProduct);
    }
}
