using System.Collections.Generic;
using UnityEngine;

namespace BlockBlast.Game
{
    [CreateAssetMenu(fileName = "PieceLibrary", menuName = "BlockBlast/PieceLibrary", order = 1)]
    public class PieceLibrary : ScriptableObject
    {
        [SerializeField] private List<Piece> pieces = new List<Piece>();

        public IReadOnlyList<Piece> Pieces => pieces;

        public Piece GetRandom()
        {
            if (pieces == null || pieces.Count == 0) return null;
            int index = Random.Range(0, pieces.Count);
            return pieces[index];
        }
    }
}
