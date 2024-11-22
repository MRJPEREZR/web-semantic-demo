package com.wdws.finalProject.models;

import java.util.List;

public class BodyRequest {
    private String stationId;
    private List<String> attributes; 
    private String dateTime;

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public String getStationId () {
        return this.stationId;
    }

    public void setAttributes(List<String> attributes) {
        this.attributes = attributes;
    }

    public List<String> getAttributes () {
        return this.attributes;
    }

    public void setDateTime (String dateTime) {
        this.dateTime = dateTime;
    }

    public String getDateTime () {
        return this.dateTime;
    }


}
