package com.demospring.demospring.service;

import com.demospring.demospring.entity.User;
import com.demospring.demospring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class LoginService {
    @Autowired
    private UsersRepository repository;

    public User saveUser(User user){
        return repository.save(user);
    }


    public User getUserByName(String name){
        return repository.findByName(name);
    }
    public List<User> getUsers(){
        return repository.findAll();
    }
    public User getUserById(int id){
        return repository.findById(id).orElse(null);
    }

    public String deleteUser(int id){
        repository.deleteById(id);
        return "removed product: " + id;
    }

    public User updateUser(User user){
        User existingUser = repository.findById(user.getId()).orElse(null);
        existingUser.setName(user.getName());
        existingUser.setPassword(user.getPassword());
        return repository.save(existingUser);

    }

}
