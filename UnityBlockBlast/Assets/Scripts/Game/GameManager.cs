using UnityEngine;

namespace BlockBlast.Game
{
    public class GameManager : MonoBehaviour
    {
        [SerializeField] private Board board;
        [SerializeField] private PieceLibrary pieceLibrary;
        [SerializeField] private int handSize = 3;

        private Piece[] currentHand;

        private void Start()
        {
            currentHand = new Piece[handSize];
            DealHand();
        }

        private void DealHand()
        {
            for (int i = 0; i < handSize; i++)
            {
                currentHand[i] = pieceLibrary.GetRandom();
            }
        }

        public bool TryPlace(Piece piece, int row, int col)
        {
            if (board.CanPlace(piece, row, col))
            {
                board.Place(piece, row, col);
                return true;
            }
            return false;
        }

        public bool HasAnyMoves()
        {
            foreach (Piece piece in currentHand)
            {
                if (piece == null) continue;
                if (board.HasAnyPlacementFor(piece))
                    return true;
            }
            return false;
        }

        public Piece[] GetCurrentHand()
        {
            return currentHand;
        }

        public void ConsumePiece(int index)
        {
            currentHand[index] = null;
            bool allUsed = true;
            for (int i = 0; i < currentHand.Length; i++)
            {
                if (currentHand[i] != null)
                {
                    allUsed = false;
                    break;
                }
            }
            if (allUsed)
            {
                DealHand();
            }
        }
    }
}
