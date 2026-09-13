package com.example.Weather_App.dto;

import java.time.LocalDate;

public class MyDay {
    private String date;
    public double maxtemp_c;
    public double mintemp_c;
    public double avgtemp_c;
    public double maxwind_kph;
    public Condition condition;

    public MyDay() {
    }

    public MyDay(String date, double maxtemp_c, double mintemp_c, double avgtemp_c, double maxwind_kph, Condition condition) {
        this.date = date;
        this.maxtemp_c = maxtemp_c;
        this.mintemp_c = mintemp_c;
        this.avgtemp_c = avgtemp_c;
        this.maxwind_kph = maxwind_kph;
        this.condition = condition;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String   date) {
        this.date = date;
    }

    public double getMaxtemp_c() {
        return maxtemp_c;
    }

    public void setMaxtemp_c(double maxtemp_c) {
        this.maxtemp_c = maxtemp_c;
    }

    public double getMintemp_c() {
        return mintemp_c;
    }

    public void setMintemp_c(double mintemp_c) {
        this.mintemp_c = mintemp_c;
    }

    public double getAvgtemp_c() {
        return avgtemp_c;
    }

    public void setAvgtemp_c(double avgtemp_c) {
        this.avgtemp_c = avgtemp_c;
    }

    public double getMaxwind_kph() {
        return maxwind_kph;
    }

    public void setMaxwind_kph(double maxwind_kph) {
        this.maxwind_kph = maxwind_kph;
    }

    public Condition getCondition() {
        return condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }
}
