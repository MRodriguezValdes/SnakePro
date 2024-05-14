using System;
using WebApplication2.GameClasses.Enums;

namespace WebApplication2.GameClasses;

public class Board
{
    private readonly CellType[][] _board;
    private readonly Random _random = new Random();

    public Board(int columns, int rows)
    {
        _board = new CellType[columns][];
        for (int i = 0; i < columns; i++)
        {
            _board[i] = new CellType[rows];
        }
        FillBoard();
    }

    private void FillBoard()
    {
        for (int i = 0; i < _board.Length; i++)
        {
            for (int j = 0; j < _board[i].Length; j++)
            {
                _board[i][j] = CellType.Empty;
            }
        }

        // Generate random objects
        for (int i = 0; i < _board.Length; i++)
        {
            for (int j = 0; j < _board[i].Length; j++)
            {
                // Check if the cell is empty
                if (_board[i][j] == CellType.Empty)
                {
                    // Generate a random number between 1 and 3
                    int randomNumber = _random.Next(0, 4);

                    // Place a random object in the cell
                    _board[i][j] = (CellType)randomNumber;
                }
            }
        }
    }

    public CellType[][] GetBoard()
    {
        return _board;
    }
}