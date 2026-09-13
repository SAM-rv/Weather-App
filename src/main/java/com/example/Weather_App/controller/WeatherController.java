package com.example.Weather_App.controller;

import com.example.Weather_App.dto.MyForecast;
import com.example.Weather_App.dto.Location;
import com.example.Weather_App.dto.Root;
import com.example.Weather_App.dto.WeatherDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.Weather_App.service.WeatherService;

@RequestMapping("/weather")
@RestController
@CrossOrigin
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

//    @GetMapping("/report/{city}")
//    public Root getWeatherReport(@PathVariable String city){
//        return weatherService.getWeatherAPI(city);
//    }

    @GetMapping("/{city}")
    public WeatherDTO getWeather(@PathVariable String city){
        return weatherService.getWeather(city);
    }

    @GetMapping("/location/{city}")
    public Location getLocation(@PathVariable String city){
        return weatherService.getLocation(city);
    }

    @GetMapping("/forecast")
    public MyForecast getForecast(@RequestParam String city, @RequestParam int days){
        return weatherService.getWeatherForecast(city,days);
    }
}
