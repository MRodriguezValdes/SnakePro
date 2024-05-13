using System;
using System.Text.Json;
using WebApplication2.GameClasses.Enums;

namespace WebApplication2.GameClasses;

public class Board
{
    private readonly CellType[,] _board;
    private readonly Random _random = new Random();

    public Board(int columns, int rows)
    {
        _board = new CellType[columns,rows];
        FillBoard();
    }

    private void FillBoard()
    {
        for (int i = 0; i < _board.GetLength(0); i++)
        {
            for (int j = 0; j < _board.GetLength(1); j++)
            {
                _board[i, j] = CellType.Empty;
            }
        }

        // Generate random objects
        for (int i = 0; i < _board.GetLength(0); i++)
        {
            for (int j = 0; j < _board.GetLength(1); j++)
            {
                // Check if the cell is empty
                if (_board[i, j] == CellType.Empty)
                {
                    // Generate a random number between 0 and 3
                    int randomNumber = _random.Next(0, 4);

                    // If the random number is 0, place a random object in the cell
                    if (randomNumber == 0)
                    {
                        _board[i, j] = (CellType)_random.Next(1, 4);
                    }
                }
            }
        }
    }

    public string ToJson()
    {
        return JsonSerializer.Serialize(_board);
    }
}