package com.wdws.finalProject.models;

public class SortRequestBody {
    private String attribute;
    private String type;
    private int lenght;

    public void setType(String type) {
        this.type = type;
    }

    public String getType () {
        return type;
    }

    public void setLenght(int lenght) {
        this.lenght = lenght;
    }

    public int getLenght() {
        return lenght;
    }

    public void setAtrribute (String attribute) {
        this.attribute = attribute;
    }

    public String getAttribute () {
        return attribute;
    }
    
}
