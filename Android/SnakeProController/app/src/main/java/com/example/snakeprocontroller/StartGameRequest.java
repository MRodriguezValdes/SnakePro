package com.example.snakeprocontroller;

public class StartGameRequest {
    private int columns;
    private int rows;

    public StartGameRequest(int columns, int rows) {
        this.columns = columns;
        this.rows = rows;
    }

    public int getColumns() {
        return columns;
    }

    public void setColumns(int columns) {
        this.columns = columns;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }
}