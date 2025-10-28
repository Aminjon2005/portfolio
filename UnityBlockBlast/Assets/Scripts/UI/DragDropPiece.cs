using UnityEngine;
using UnityEngine.EventSystems;

namespace BlockBlast.UI
{
    public class DragDropPiece : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler
    {
        [SerializeField] private BlockBlast.Game.GameManager gameManager;
        [SerializeField] private BlockBlast.Game.Piece piece;
        [SerializeField] private RectTransform dragRoot;

        private Vector3 originalPosition;

        public void OnBeginDrag(PointerEventData eventData)
        {
            originalPosition = dragRoot.position;
        }

        public void OnDrag(PointerEventData eventData)
        {
            dragRoot.position += (Vector3)eventData.delta;
        }

        public void OnEndDrag(PointerEventData eventData)
        {
            // Placeholder: snap to grid and attempt placement via gameManager.TryPlace
            dragRoot.position = originalPosition;
        }
    }
}
