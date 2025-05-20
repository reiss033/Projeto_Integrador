const board = document.getElementById("board");
let draggedCard = null;
let placeholder = document.createElement("div");
placeholder.className = "bg-blue-200 border-2 border-dashed border-blue-400 rounded h-12 mb-2";

function getDropTarget(e) {
  const target = e.target;

  if (
    target.classList.contains("cursor-move") &&
    target.parentElement &&
    target.parentElement.hasAttribute("data-cards-container")
  ) {
    const rect = target.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    return offset > rect.height / 2 ? target.nextSibling : target;
  }

  if (target.hasAttribute("data-cards-container")) {
    return null;
  }

  return null;
}

board.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("cursor-move")) {
    draggedCard = e.target;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", e.target.dataset.cardId);
    e.target.classList.add("opacity-50");
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
  }
});

board.addEventListener("dragend", (e) => {
  if (draggedCard) {
    draggedCard.classList.remove("opacity-50");
    draggedCard.style.display = "block";
    draggedCard = null;
  }
  if (placeholder.parentElement) {
    placeholder.parentElement.removeChild(placeholder);
  }
});

board.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!draggedCard) return;

  const dropContainer = e.target.closest("[data-cards-container]");
  if (!dropContainer) return;

  const dropTarget = getDropTarget(e);

  if (dropTarget) {
    if (dropTarget !== placeholder) {
      dropContainer.insertBefore(placeholder, dropTarget);
    }
  } else {
    dropContainer.appendChild(placeholder);
  }
});

board.addEventListener("drop", (e) => {
  e.preventDefault();
  if (!draggedCard) return;

  const dropContainer = e.target.closest("[data-cards-container]");
  if (!dropContainer) return;

  if (placeholder.parentElement) {
    dropContainer.insertBefore(draggedCard, placeholder);
    placeholder.parentElement.removeChild(placeholder);
  } else {
    dropContainer.appendChild(draggedCard);
  }
});