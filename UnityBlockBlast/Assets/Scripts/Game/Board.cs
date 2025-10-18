using System;
using System.Collections.Generic;
using UnityEngine;

namespace BlockBlast.Game
{
    public enum CellState
    {
        Empty = 0,
        Filled = 1
    }

    [Serializable]
    public class BoardDimensions
    {
        public int columns = 10;
        public int rows = 10;
    }

    public class Board : MonoBehaviour
    {
        [SerializeField] private BoardDimensions dimensions = new BoardDimensions();
        private CellState[,] grid;

        public int Columns => dimensions.columns;
        public int Rows => dimensions.rows;

        public event Action<List<int>, List<int>> OnLinesCleared; // clearedRows, clearedCols

        private void Awake()
        {
            grid = new CellState[Rows, Columns];
            ClearAll();
        }

        public void ClearAll()
        {
            for (int r = 0; r < Rows; r++)
            {
                for (int c = 0; c < Columns; c++)
                {
                    grid[r, c] = CellState.Empty;
                }
            }
        }

        public bool CanPlace(Piece piece, int anchorRow, int anchorCol)
        {
            foreach (Vector2Int block in piece.Blocks)
            {
                int r = anchorRow + block.y;
                int c = anchorCol + block.x;
                if (r < 0 || r >= Rows || c < 0 || c >= Columns)
                    return false;
                if (grid[r, c] == CellState.Filled)
                    return false;
            }
            return true;
        }

        public void Place(Piece piece, int anchorRow, int anchorCol)
        {
            foreach (Vector2Int block in piece.Blocks)
            {
                int r = anchorRow + block.y;
                int c = anchorCol + block.x;
                grid[r, c] = CellState.Filled;
            }

            CheckAndClearLines();
        }

        public IReadOnlyList<Vector2Int> GetAllEmptyCells()
        {
            List<Vector2Int> cells = new List<Vector2Int>(Rows * Columns);
            for (int r = 0; r < Rows; r++)
            {
                for (int c = 0; c < Columns; c++)
                {
                    if (grid[r, c] == CellState.Empty)
                        cells.Add(new Vector2Int(c, r));
                }
            }
            return cells;
        }

        public bool HasAnyPlacementFor(Piece piece)
        {
            for (int r = 0; r < Rows; r++)
            {
                for (int c = 0; c < Columns; c++)
                {
                    if (CanPlace(piece, r, c))
                        return true;
                }
            }
            return false;
        }

        private void CheckAndClearLines()
        {
            List<int> fullRows = new List<int>();
            List<int> fullCols = new List<int>();

            for (int r = 0; r < Rows; r++)
            {
                bool full = true;
                for (int c = 0; c < Columns; c++)
                {
                    if (grid[r, c] == CellState.Empty)
                    {
                        full = false;
                        break;
                    }
                }
                if (full) fullRows.Add(r);
            }

            for (int c = 0; c < Columns; c++)
            {
                bool full = true;
                for (int r = 0; r < Rows; r++)
                {
                    if (grid[r, c] == CellState.Empty)
                    {
                        full = false;
                        break;
                    }
                }
                if (full) fullCols.Add(c);
            }

            if (fullRows.Count == 0 && fullCols.Count == 0)
                return;

            foreach (int r in fullRows)
            {
                for (int c = 0; c < Columns; c++)
                {
                    grid[r, c] = CellState.Empty;
                }
            }

            foreach (int c in fullCols)
            {
                for (int r = 0; r < Rows; r++)
                {
                    grid[r, c] = CellState.Empty;
                }
            }

            OnLinesCleared?.Invoke(fullRows, fullCols);
        }

        public CellState GetCell(int row, int col)
        {
            return grid[row, col];
        }
    }
}
