package com.demospring.demospring.controller;

import com.demospring.demospring.entity.Product;
import com.demospring.demospring.entity.ProductImages;
import com.demospring.demospring.service.ProductImagesService;
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
public class ProductController {

    @Autowired
    private ProductService service;

    @Autowired
    private ProductImagesService imageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("info") String info,
            @RequestParam("availableQuantity") int quantity ) {

        System.out.println(name+price+info+quantity);

        String imageFilename = UUID.randomUUID().toString() + name;
        Path imagePath = Paths.get("./", imageFilename);

        try {
            Files.copy(file.getInputStream(), imagePath);
            Product product = new Product();
            product.setName(name);
           // product.setImageUrl("./IdeaProjects/demoSpring/" + imageFilename);
            product.setPrice(price);
            product.setInfo(info);
            product.setAvailableQuantity(quantity);
            service.saveProduct(product);

            ProductImages productImage = new ProductImages();
            productImage.setName(name);
            productImage.setImageUrl("./IdeaProjects/demoSpring/" + imageFilename);
            productImage.setProductId(product.getId());
           // product.getProductImages().add(productImage);
            imageService.saveProductImage(productImage);

            return ResponseEntity.ok("Product uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }


    @PostMapping("/addProduct")
    public Product addProduct(@RequestBody Product product){
        return service.saveProduct(product);
    }
    @PostMapping("/addProducts")

    public List<Product> addProducts(@RequestBody List<Product> products){
        return service.saveProducts(products);
    }
    @GetMapping("/products")
    public List<Product> findAllProducts(){
        return service.getProducts();
    }
    @GetMapping("/productId/{id}")
    public Product findProductById(@PathVariable int id){
        return service.getProductById(id);
    }

    @GetMapping("/product/{name}")
    public Product findProductByName(@PathVariable String name){
        return service.getProductByName(name);
    }

    @PutMapping("/update")
    public Product updateProduct(@RequestBody Product product){
        return service.updateProduct(product);
    }
    @DeleteMapping("/deleteProduct/{id}")
    public String deleteProduct(@PathVariable int id){
        imageService.deleteProductImagesByProductId(id);
        return service.deleteProduct(id);
    }

    @DeleteMapping("/deleteName/{name}")
    public String deleteProductByName(@PathVariable String name){
        return service.deleteProductByName(name);
    }
}

//curl -X POST -H "Content-Type: application/json" -d '[{"id":8,"name":"Name322","quantity":6,"price":3.22},{"id":5,"name":"Name23","quantity":4,"price":23.99}]' http://localhost:9191/addProducts
