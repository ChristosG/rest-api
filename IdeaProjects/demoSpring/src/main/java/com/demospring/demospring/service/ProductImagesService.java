package com.demospring.demospring.service;

import com.demospring.demospring.entity.ProductImages;
import com.demospring.demospring.repository.ProductImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class ProductImagesService {
    @Autowired
    private ProductImagesRepository repository;


    public ProductImages saveProductImage(ProductImages product){
        return repository.save(product);
    }

    public List<ProductImages> saveProductImages(List<ProductImages> products){
        return repository.saveAll(products);
    }

    public ProductImages getProductByName(String name){
        return repository.findByName(name);
    }
    @Transactional
    public List<ProductImages> getProductImagesByProduct_id(int product_id){
        return repository.findByProductId(product_id);
    }

    public List<ProductImages> getProductImages(){
        return repository.findAll();
    }
    public ProductImages getProductImagesById(int id){
        return repository.findById(id).orElse(null);
    }

    public String deleteProductImages(int id){
        repository.deleteById(id);
        return "removed product: " + id;
    }
    @Transactional
    public String deleteProductImagesByName(String name){
        repository.deleteByName(name);
        return "removed product: " + name;
    }
    @Transactional
    public String deleteProductImagesByProductId(int product_id){
        repository.deleteByProductId(product_id);
        return "removed product: " + product_id;
    }
    public ProductImages updateProductImage(ProductImages product){
        ProductImages existingProduct = repository.findById(product.getId()).orElse(null);
        existingProduct.setName(product.getName());
        existingProduct.setProductId(product.getProductId());
        existingProduct.setImageUrl(product.getImageUrl());
        return repository.save(existingProduct);
    }
}
