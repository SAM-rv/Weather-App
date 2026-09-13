package com.example.Weather_App.dto;

public class WeatherDTO {
    private String city;
    private String region;
    private String country;
    private double temperature ;
    private String condition;
    private int localtime;

    public WeatherDTO(String city, String region, String country, double temperature, String condition, int localtime) {
        this.city = city;
        this.region = region;
        this.country = country;
        this.temperature = temperature;
        this.condition = condition;
        this.localtime = localtime;
    }

    public WeatherDTO(){

    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public int getLocaltime() {
        return localtime;
    }

    public void setLocaltime(int localtime) {
        this.localtime = localtime;
    }
}
