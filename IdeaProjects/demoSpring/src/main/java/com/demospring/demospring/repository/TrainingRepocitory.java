package com.demospring.demospring.repository;

import com.demospring.demospring.entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingRepocitory extends JpaRepository<Training, Integer> {
    Training findByName(String name);
    //List<Product> saveProducts(List<Product> products);
}
