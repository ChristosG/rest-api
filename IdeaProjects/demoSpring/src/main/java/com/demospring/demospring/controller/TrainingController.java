package com.demospring.demospring.controller;

import com.demospring.demospring.entity.Training;
import com.demospring.demospring.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class TrainingController {


        @Autowired
        private TrainingService service;
        private  final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        @PostMapping("/addTraining")
        public Training addTraining(@RequestBody Training training){

            return service.saveTraining(training);
        }

    /*    @PostMapping("/getUser")
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

        }*/



        @GetMapping("/training/id")
        public Training findUserById(@PathVariable int id){

            return service.getTrainingById(id);
        }
        @GetMapping("/training/{name}")
        public Training findUserByName(@PathVariable String name){
            return service.getTrainingByUser(name);
        }

        @PutMapping("/updateTraining")
        public Training updateTraining(@RequestBody Training training){
            return service.updateTraining(training);
        }


    @DeleteMapping("/deleteTraining/{id}") //init all to null ektos apo to name k id
        public String deleteUser(@PathVariable int id){

            return service.deleteTraining(id);
        }
    }
