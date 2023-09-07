package com.demospring.demospring.service;

import com.demospring.demospring.entity.UserDetails;
import com.demospring.demospring.repository.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class UserDetailsService {
    @Autowired
    private UserDetailsRepository repository;


    public UserDetails saveUserDetails(UserDetails userDetails){
        return repository.save(userDetails);
    }

    public List<UserDetails> saveUserDetails2(List<UserDetails> userDetails){
        return repository.saveAll(userDetails);
    }
    @Transactional
    public UserDetails getUserDetailsByUserId(int id){
        return repository.findByUserId(id);
    }
    public List<UserDetails> getUserDetails(){
        return repository.findAll();
    }
    public UserDetails getUserDetailsById(int id){
        return repository.findById(id).orElse(null);
    }

    public String deleteProduct(int id){
        repository.deleteById(id);
        return "removed product: " + id;
    }
    @Transactional
    public String deleteUserDetailsByUserId(int id){
        repository.deleteByUserId(id);
        return "removed product: " + id;
    }
    public void updateUserDetails(UserDetails userDetails){
        UserDetails existingUserDetails = repository.findByUserId(userDetails.getUserId());//.orElse(null);

        try{
            if (existingUserDetails == null) {
                existingUserDetails = new UserDetails();
                existingUserDetails.setUserId(userDetails.getUserId());
                //System.out.println("inside");
            }
                if (userDetails.getAddress1() != null) {
                    existingUserDetails.setAddress1(userDetails.getAddress1());
                }
                if (userDetails.getAddress2() != null) {
                    existingUserDetails.setAddress2(userDetails.getAddress2());
                }
                if (userDetails.getTk() != null) {
                    existingUserDetails.setTk(userDetails.getTk());
                }
                if (userDetails.getCity() != null) {
                    existingUserDetails.setCity(userDetails.getCity());
                }
                if (userDetails.getBirthdate() != null) {
                    existingUserDetails.setBirthdate(userDetails.getBirthdate());
                }
                if (userDetails.getEmail() != null) {
                    existingUserDetails.setEmail(userDetails.getEmail());
                }
                repository.save(existingUserDetails);



        } catch(Exception e){
            e.printStackTrace();
        }

           // return repository.save(existingUserDetails);
    }
}
