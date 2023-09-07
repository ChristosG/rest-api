package com.demospring.demospring.controller;

import com.demospring.demospring.entity.UserDetails;
import com.demospring.demospring.service.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
public class UserDetailsController {

    @Autowired
    private UserDetailsService service;


    @PutMapping("/addAddress")
    public String addUser(@RequestBody UserDetails userDetails){

        if (userDetails.getAddress1().equals("")){
            return "Empty Address1";
        } else if (userDetails.getAddress2().equals("")) {
            return "Empty Address2";

        } else if (userDetails.getCity().equals("")) {
            return "Empty city";

        } else if (userDetails.getTk().equals("")) {
            return "Empty tk";

        }else{
            service.updateUserDetails(userDetails);
            return "Success";
        }
    }

    @PostMapping("/addRestDetails")
    public ResponseEntity<String>  addRestDetails(@RequestParam("userId") int user_id,
                                                 @RequestParam("email") String email,
                                                 @RequestParam("date") String date)
    {
        System.out.println(user_id+email+date);
        UserDetails userDetails = new UserDetails();
        userDetails.setUserId(user_id);
        try{
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MMMM-d");
            LocalDate parsedDate;
            try {
                parsedDate = LocalDate.parse(date, formatter);
                userDetails.setBirthdate(parsedDate);
                System.out.println(parsedDate);

            } catch (DateTimeParseException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
            }finally {
                if (!email.isEmpty()){
                    userDetails.setEmail(email);
                }
                service.updateUserDetails(userDetails);
            }
            return ResponseEntity.ok("Email/date inserted successfully.");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/details")
    public List<UserDetails> findAllProducts(){
        return service.getUserDetails();
    }
    @GetMapping("/getUserDetailsId/{id}")
    public UserDetails findUserDetailsById(@PathVariable int id){
        return service.getUserDetailsById(id);
    }

    @GetMapping("/getUserDetailsByUserId/{id}")
    public UserDetails findUserDetailsByUserId(@PathVariable int id){
        return service.getUserDetailsByUserId(id);
    }


    @DeleteMapping("/deleteDetails/{id}")
    public String deleteUserDetailsByUserId(@PathVariable int id){
        return service.deleteUserDetailsByUserId(id);
    }
}

