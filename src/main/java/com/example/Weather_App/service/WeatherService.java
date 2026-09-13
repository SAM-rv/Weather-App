package com.example.Weather_App.service;

import com.example.Weather_App.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    @Value("${weather.api.url}")
    private String apiUrl;

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.forecast.url}")
    private String forecastUrl;

    private RestTemplate template=new RestTemplate();

    public Root getWeatherAPI(String city) {
        String url = apiUrl + "?key=" + apiKey + "&q=" + city;
        Root root = template.getForObject(url, Root.class);
        return root;
    }

    public WeatherDTO getWeather(String city){
        String url=apiUrl+"?key="+apiKey+"&q="+city;
        Root root= template.getForObject(url, Root.class);
        WeatherDTO weatherDTO=new WeatherDTO(
                root.getLocation().getName(),
                root.getLocation().getRegion(),
                root.getLocation().getCountry(),
                root.getCurrent().getTemp_c(),
                root.getCurrent().getCondition().getText(),
                root.getLocation().getLocaltime_epoch()
        );
        return weatherDTO;
    }

    public Location getLocation(String city){
        String url=apiUrl+"?key="+apiKey+"&q="+city;
        Root root =template.getForObject(url,Root.class);
        return root.getLocation();
    }

    public MyForecast getWeatherForecast(String city,int days){
        String url=forecastUrl+"?key="+apiKey+"&q="+city+"&days="+days;
        Root root=template.getForObject(url,Root.class);
        WeatherDTO weatherDTO=new WeatherDTO(
                root.getLocation().getName(),
                root.getLocation().getRegion(),
                root.getLocation().getCountry(),
                root.getCurrent().getTemp_c(),
                root.getCurrent().getCondition().getText(),
                root.getLocation().getLocaltime_epoch()
        );
        List<MyDay> myday=new ArrayList<>();
        for(Forecastday forecastday:root.getForecast().getForecastday()){
            myday.add(new MyDay(
                    forecastday.getDate(),
                    forecastday.getDay().getMaxtemp_c(),
                    forecastday.getDay().getMintemp_c(),
                    forecastday.getDay().getAvgtemp_c(),
                    forecastday.getDay().getMaxwind_kph(),
                    forecastday.getDay().getCondition()
            ));
        }
        return new MyForecast(
                weatherDTO,
                myday
        );
    }
}