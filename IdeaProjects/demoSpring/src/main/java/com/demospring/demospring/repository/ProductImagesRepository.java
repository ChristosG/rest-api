package com.demospring.demospring.repository;

import com.demospring.demospring.entity.ProductImages;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProductImagesRepository extends JpaRepository<ProductImages, Integer> {
     ProductImages findByName(String name);
    List<ProductImages> findByProductId(int product_id);
    void deleteByName(String name);
    void deleteByProductId(int product_id);

}
