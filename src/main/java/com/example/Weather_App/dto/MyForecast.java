package com.example.Weather_App.dto;

import java.util.List;

public class MyForecast {
    private WeatherDTO weatherDTO;
    private List<MyDay> dayForecast;

    public MyForecast() {
    }

    public MyForecast(WeatherDTO weatherDTO, List<MyDay> dayForecast) {
        this.weatherDTO = weatherDTO;
        this.dayForecast = dayForecast;
    }

    public WeatherDTO getWeatherDTO() {
        return weatherDTO;
    }

    public void setWeatherDTO(WeatherDTO weatherDTO) {
        this.weatherDTO = weatherDTO;
    }

    public List<MyDay> getDayForecast() {
        return dayForecast;
    }

    public void setDayForecast(List<MyDay> dayForecast) {
        this.dayForecast = dayForecast;
    }
}
