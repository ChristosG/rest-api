package com.demospring.demospring;

import com.demospring.demospring.entity.UserDetails;
import com.demospring.demospring.repository.UserDetailsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.Mockito.when;


@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserDetailsTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private UserDetailsRepository repository;

    @Test
    public void testFindUserDetailsById() throws Exception {
        int userId = 754;
        int id = 252;
        UserDetails userDetails = new UserDetails();
        userDetails.setId(id);
        userDetails.setUserId(userId);
        userDetails.setBirthdate(LocalDate.of(1995, 1, 2));
        userDetails.setEmail("bbbbbbbb");
        userDetails.setAddress1("aaa");
        userDetails.setAddress2("ccc");
        userDetails.setCity("ccc");
        userDetails.setTk("123454");

        when(repository.findById(userId)).thenReturn(Optional.of(userDetails));

        mockMvc.perform(MockMvcRequestBuilders.get("/getUserDetailsId/{id}",id))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(userDetails.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").value(userDetails.getUserId()))
                //.andExpect(MockMvcResultMatchers.jsonPath("$.birthdate").value(userDetails.getBirthdate().toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(userDetails.getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.address1").value(userDetails.getAddress1()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.city").value(userDetails.getCity()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.tk").value(userDetails.getTk()));
    }
}
