package com.demospring.demospring.controller;

import com.demospring.demospring.entity.User;
import com.demospring.demospring.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class UsersController {

    @Autowired
    private LoginService service;
    private  final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @PostMapping("/addUser")
    public String addUser(@RequestBody User user){
        if (!user.getPassword().equals("") || !user.getPassword().trim().isEmpty()) {
            user.setName(user.getName());
            user.setPassword(encoder.encode(user.getPassword()));
            service.saveUser(user);
            return user.getName();
        }else{
            user.setPassword(null);
            System.out.println(user.getPassword());
            return "empty password";
        }
       // return service.saveUser(user);
    }

    @PostMapping("/getUser")
    public String login(@RequestBody User user) {
        String username = user.getUsername();
        String enteredPassword = user.getPassword();

        User us = service.getUserByName(username);

        if (us != null) {

            if (encoder.matches(enteredPassword, us.getPassword())) {
                return "Login successful";
            } else {
                return "Login failed";
            }
        } else {
            return "User not found";
        }

    }

    @GetMapping("/users")
    public List<User> findAllUser(){
        return service.getUsers();
    }

    @GetMapping("/user/id")
    public User findUserById(@PathVariable int id){

        return service.getUserById(id);
    }
    @GetMapping("/user/{name}")
    public User findUserByName(@PathVariable String name){

        return service.getUserByName(name);
    }

    @PutMapping("/updatePassword")
    public User updatePassword(@RequestBody User user){
        user.setPassword(encoder.encode(user.getPassword()));
        return service.updateUser(user);
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable int id){

        return service.deleteUser(id);
    }
}

//curl -X POST -H "Content-Type: application/json" -d '[{"id":8,"name":"Name322","quantity":6,"price":3.22},{"id":5,"name":"Name23","quantity":4,"price":23.99}]' http://localhost:9191/addProducts
////curl -X POST -H "Content-Type: application/json" -d '{"name":"user22","password":"1234"}' http://localhost:9191/addUser
//curl -X GET -H "Content-Type: application/json" -d '{}' http://localhost:9191/getUser