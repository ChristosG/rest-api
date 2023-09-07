package com.demospring.demospring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "training")
public class Training {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        //@OneToOne
        //@JoinColumn(name = "name", unique = true)
        //@Column(name = "name", unique = true)
       // @OneToOne(mappedBy = "name")
        @Column(unique = true)
        private String name;

        // Other fields and constructors

   // @JoinColumn(name = "username", referencedColumnName = "name")

    @Column
    private float miles;

    @Column
    private float calories;

    public void updateMilesAndCalories(float newMiles, float newCalories) {
        this.miles = newMiles;
        this.calories = newCalories;
    }


}
