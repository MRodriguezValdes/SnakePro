package com.example.snakeprocontroller;

public class StartGameRequest {
    // Number of columns for the game grid
    private int columns;
    // Number of rows for the game grid
    private int rows;

    // Constructor to initialize the request with columns and rows
    public StartGameRequest(int columns, int rows) {
        this.columns = columns;
        this.rows = rows;
    }

    // Getter for the columns field
    public int getColumns() {
        return columns;
    }

    // Setter for the columns field
    public void setColumns(int columns) {
        this.columns = columns;
    }

    // Getter for the rows field
    public int getRows() {
        return rows;
    }

    // Setter for the rows field
    public void setRows(int rows) {
        this.rows = rows;
    }
}