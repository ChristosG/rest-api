package com.demospring.demospring.repository;

import com.demospring.demospring.entity.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserDetailsRepository extends JpaRepository<UserDetails, Integer> {
    UserDetails findByUserId(int user_id);
  //  List<UserDetails> findByUserId(int user_id);
    void deleteByUserId(int product_id);

}
