package com.demospring.demospring.controller;

import com.demospring.demospring.entity.ProductImages;
import com.demospring.demospring.service.ProductImagesService;
import com.demospring.demospring.entity.Product;
import com.demospring.demospring.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


@RestController
public class ProductImagesController {

    @Autowired
    private ProductImagesService service;
    @Autowired
    private ProductService productService;

    @PostMapping("/uploadMoreImages")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("product_id") int product_id){

        Product dummyProduct = productService.getProductById(product_id);
        System.out.println(dummyProduct + dummyProduct.getName());

        String imageFilename = UUID.randomUUID().toString() + name;
        Path imagePath = Paths.get("./", imageFilename);
        try {
            Files.copy(file.getInputStream(), imagePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }

        ProductImages productImage = new ProductImages();
        productImage.setName(name);
        productImage.setImageUrl("./IdeaProjects/demoSpring/" + imageFilename);
        productImage.setProductId(product_id);
        //productService.saveProductImage(productImage);

        service.saveProductImage(productImage);

        return ResponseEntity.ok("Product uploaded successfully.");
    }


    @PostMapping("/addImage")
    public ProductImages addProductImage(@RequestBody ProductImages product){
        return service.saveProductImage(product);
    }
    @PostMapping("/addImages")

    public List<ProductImages> addProductImages(@RequestBody List<ProductImages> products){
        return service.saveProductImages(products);
    }
    @GetMapping("/images")
    public List<ProductImages> findAllProductImages(){
        return service.getProductImages();
    }
    @GetMapping("/image/{id}")
    public ProductImages findProductImagesById(@PathVariable int id){
        return service.getProductImagesById(id);
    }

    @GetMapping("/imageByProductId/{product_id}")
    public List<ProductImages> findProductImagesByProductByProductId(@PathVariable int product_id){
        return service.getProductImagesByProduct_id(product_id);
    }

    @PutMapping("/updateProductImages")
    public ProductImages updateProductImage(@RequestBody ProductImages product){
        return service.updateProductImage(product);
    }
    @DeleteMapping("/deleteProductImage/{id}")
    public String deleteProductImages(@PathVariable int id){
        return service.deleteProductImages(id);
    }

    @DeleteMapping("/deleteProductImagesByName/{name}")
    public String deleteProductImagesByName(@PathVariable String name){
        return service.deleteProductImagesByName(name);
    }
}

