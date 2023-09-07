
package com.demospring.demospring.repository;

import com.demospring.demospring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsersRepository extends JpaRepository<User, Integer> {
    User findByName(String name);
    //List<Product> saveProducts(List<Product> products);
}
