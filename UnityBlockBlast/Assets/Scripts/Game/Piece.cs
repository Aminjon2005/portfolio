using System.Collections.Generic;
using UnityEngine;

namespace BlockBlast.Game
{
    [CreateAssetMenu(fileName = "Piece", menuName = "BlockBlast/Piece", order = 0)]
    public class Piece : ScriptableObject
    {
        [SerializeField] private List<Vector2Int> blocks = new List<Vector2Int>();
        [SerializeField] private Color color = Color.white;
        [SerializeField] private string displayName = "Piece";

        public IReadOnlyList<Vector2Int> Blocks => blocks;
        public Color Color => color;
        public string DisplayName => displayName;

        public static Piece FromShape(params Vector2Int[] shape)
        {
            var piece = CreateInstance<Piece>();
            piece.blocks = new List<Vector2Int>(shape);
            return piece;
        }
    }
}
