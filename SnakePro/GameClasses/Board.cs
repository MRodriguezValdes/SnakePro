using WebApplication2.GameClasses.Enums;

namespace WebApplication2.GameClasses;

public class Board
{
    private readonly CellType[][] _board;
    private readonly Random _random = new Random();

    public Board(int columns, int rows)
    {
        _board = new CellType[columns][];
        GenerateBoard(columns, rows);
        FillBoard();
    }

    private void GenerateBoard(int columns, int rows)
    {
        for (var i = 0; i < columns; i++)
        {
            _board[i] = new CellType[rows];
        }
    }

    private void FillBoard()
    {
        foreach (var row in _board)
        {
            for (var columns = 0; columns < row.Length; columns++)
            {
                row[columns] = CellType.Empty;
            }
        }
    }

    private bool IsValidCell(int x, int y)
    {
        return x >= 0 && x < _board.Length && y >= 0 && y < _board[0].Length && _board[x][y] == CellType.Empty;
    }

    public (int, int) GetRandomValidCell()
    {
        int x, y;
        do
        {
            x = _random.Next(0, _board.Length);
            y = _random.Next(0, _board[0].Length);
        } while (!IsValidCell(x, y));

        return (x, y);
    }
    public CellType[][] GetBoard()
    {
        return _board;
    }
    public void GenerateFood(int howMany)
    {
        for (var i = 0; i < howMany; i++)
        {
            var (x, y) =GetRandomValidCell();
            _board[x][y] = CellType.Food;
        }
    }
}