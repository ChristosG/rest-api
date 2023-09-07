package com.demospring.demospring.service;

import com.demospring.demospring.entity.Training;
import com.demospring.demospring.repository.TrainingRepocitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class TrainingService {
    @Autowired
    private TrainingRepocitory repository;

    public Training saveTraining(Training training){
        return repository.save(training);
    }

    public Training getTrainingByUser(String name){
        return repository.findByName(name);
    }
  /*  public List<User> getUsers(){
        return repository.findAll();
    }*/
    public Training getTrainingById(int id){
        return repository.findById(id).orElse(null);
    }
    public Training updateTraining(Training training){
        //Training existingTraining=repository.findById(training.getId()).orElse(null);
        //existingTraining.setName(training.getName());
        //existingTraining.setMiles(training.getMiles());
        //existingTraining.setCalories(training.getCalories());
        Training existingTraining = repository.findByName(training.getName());

        if (existingTraining != null) {
            existingTraining.updateMilesAndCalories(training.getMiles(), training.getCalories());
            return repository.save(existingTraining);
        } else {
            Training newTraining = new Training();
            //newTraining.setId(490);
            newTraining.setName(training.getName());
            newTraining.setMiles(training.getMiles());
            newTraining.setCalories(training.getCalories());
            return repository.save(newTraining);
        }
       // return repository.save(existingTraining);
    }

    public String deleteTraining(int id){
        repository.deleteById(id);
        return "removed product: " + id;
    }

}
