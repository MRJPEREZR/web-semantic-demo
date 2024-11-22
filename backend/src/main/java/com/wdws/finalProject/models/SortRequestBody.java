package com.wdws.finalProject.models;

public class SortRequestBody {
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
    
}
