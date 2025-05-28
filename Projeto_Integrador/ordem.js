 const tabs = {
      "tab-modelo": ["content-modelo", "content-modelo-2", "content-km", "content-chassi", "content-descricao"],
      "tab-observacoes": ["content-observacoes", "content-descricao"],
      "tab-laudo": ["content-laudo", "content-descricao"],
      "tab-servicos": ["content-servicos", "content-descricao"],
      "tab-status": ["content-status", "content-descricao"],
      "tab-entrega": ["content-entrega", "content-descricao"]
    };

    function hideAllContent() {
      const allContent = document.querySelectorAll(
        "#content-modelo, #content-modelo-2, #content-km, #content-chassi, #content-observacoes, #content-laudo, #content-servicos, #content-status, #content-entrega, #content-descricao"
      );
      allContent.forEach(el => el.classList.add("hidden"));
    }

    function resetTabs() {
      document.querySelectorAll("#modalContainer .flex > button").forEach(btn => {
        btn.classList.remove("bg-[#c0c0c0]", "font-semibold");
      });
    }

    function showTabContent(tabId) {
      hideAllContent();
      resetTabs();
      const tab = document.getElementById(tabId);
      if (!tab) return;
      tab.classList.add("bg-[#c0c0c0]", "font-semibold");
      const contentIds = tabs[tabId];
      if (contentIds && contentIds.length > 0) {
        contentIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.remove("hidden");
        });
      }
    }

    Object.keys(tabs).forEach(tabId => {
      const tab = document.getElementById(tabId);
      if (tab) {
        tab.addEventListener("click", () => {
          showTabContent(tabId);
        });
      }
    });

    // Initialize with "Modelo Veículo" tab active
    showTabContent("tab-modelo");

    // Modal open/close logic
    const btnAdd = document.getElementById("btnAdd");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalContainer = document.getElementById("modalContainer");
    const btnClose = document.getElementById("btnClose");
    const btnMinimize = document.getElementById("btnMinimize");
    const btnMaximize = document.getElementById("btnMaximize");
    const btnIncluir = document.getElementById("btnIncluir");
    const selectStatus = document.getElementById("selectStatus");

    // Dynamically populate selectStatus options from current board columns
    function populateStatusOptions() {
      const board = document.getElementById("board");
      const sections = board.querySelectorAll("section[data-list-id]");
      selectStatus.innerHTML = "";
      sections.forEach(section => {
        const listId = section.getAttribute("data-list-id");
        const headerText = section.querySelector("header").textContent.trim();
        const option = document.createElement("option");
        option.value = listId;
        option.textContent = headerText;
        selectStatus.appendChild(option);
      });
    }

    populateStatusOptions();

    function openModal() {
      modalOverlay.classList.remove("hidden");
      modalContainer.classList.remove("hidden");
      // Reset modal size and position
      modalContainer.style.width = "";
      modalContainer.style.height = "";
      modalContainer.style.top = "";
      modalContainer.style.left = "";
      modalContainer.style.position = "fixed";
      // Show all children
      [...modalContainer.children].forEach(child => {
        child.style.display = "";
      });
    }

    function closeModal() {
      modalOverlay.classList.add("hidden");
      modalContainer.classList.add("hidden");
    }

    function minimizeModal() {
      modalContainer.style.width = "200px";
      modalContainer.style.height = "28px";
      modalContainer.style.top = "auto";
      modalContainer.style.left = "auto";
      modalContainer.style.position = "fixed";
      // Hide all children except title bar
      [...modalContainer.children].forEach(child => {
        if (!child.querySelector || !child.querySelector('.flex.items-center.justify-between')) {
          child.style.display = "none";
        } else {
          child.style.display = "flex";
        }
      });
    }

    function maximizeModal() {
      modalContainer.style.width = "100vw";
      modalContainer.style.height = "100vh";
      modalContainer.style.top = "0";
      modalContainer.style.left = "0";
      modalContainer.style.position = "fixed";
      // Show all children
      [...modalContainer.children].forEach(child => {
        child.style.display = "";
      });
    }

    btnAdd.addEventListener("click", openModal);
    btnClose.addEventListener("click", closeModal);
    btnMinimize.addEventListener("click", minimizeModal);
    btnMaximize.addEventListener("click", maximizeModal);

    // Close modal when clicking outside content
    modalOverlay.addEventListener("click", closeModal);

    // Drag and Drop handlers
    let draggedCard = null;

    function dragStart(event) {
      draggedCard = event.currentTarget;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", null);
      setTimeout(() => {
        draggedCard.classList.add("opacity-50");
      }, 0);
    }

    function dragEnd(event) {
      if (draggedCard) {
        draggedCard.classList.remove("opacity-50");
        draggedCard = null;
      }
    }

    function dropCard(event, targetListId) {
      event.preventDefault();
      if (!draggedCard) return;
      const targetList = document.getElementById(targetListId);
      if (!targetList) return;
      targetList.appendChild(draggedCard);
      draggedCard.classList.remove("opacity-50");
      draggedCard = null;
      closeModal();
    }

    // Add drag event listeners to existing cards and new cards
    function addDragListeners(card) {
      card.addEventListener("dragstart", dragStart);
      card.addEventListener("dragend", dragEnd);
    }

    // Initialize drag listeners for existing cards
    document.querySelectorAll("[data-cards-container] article").forEach(addDragListeners);

    // Function to create a new card in the correct list based on selected status
    btnIncluir.addEventListener("click", () => {
      // Get values from inputs
      const codigo = document.getElementById("inputCodigo").value.trim();
      const cliente = document.getElementById("inputCliente").value.trim();
      const statusSelecionado = selectStatus.value;

      if (!codigo || !cliente) {
        alert("Por favor, preencha os campos Código e Cliente.");
        return;
      }

      // Map statusSelecionado to list container ID
      const targetListId = statusSelecionado + "Cards";
      const targetList = document.getElementById(targetListId);
      if (!targetList) {
        alert("Lista de destino não encontrada.");
        return;
      }

      // Create new card element
      const newCard = document.createElement("article");
      newCard.setAttribute("draggable", "true");
      newCard.className = "bg-white rounded p-2 shadow-sm border border-[#ccc] cursor-move";

      // Add a colored bar based on statusSelecionado
      let barColor = "#b04632"; // default red
      if (statusSelecionado === "em-andamento") barColor = "#0079bf"; // blue
      else if (statusSelecionado === "prioridade") barColor = "#f2d600"; // yellow

      const barDiv = document.createElement("div");
      barDiv.className = "h-1 w-10 rounded mb-1";
      barDiv.style.backgroundColor = barColor;
      newCard.appendChild(barDiv);

      // Card text content
      const p = document.createElement("p");
      p.className = "text-xs leading-tight";
      p.textContent = `OS ${codigo} - ${cliente}`;
      newCard.appendChild(p);

      // Insert new card at the top of the list for order
      if (targetList.firstChild) {
        targetList.insertBefore(newCard, targetList.firstChild);
      } else {
        targetList.appendChild(newCard);
      }

      // Add drag listeners to new card
      addDragListeners(newCard);

      // Close modal after inclusion
      closeModal();

      // Optionally clear inputs or reset form here
    });
  