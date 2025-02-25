// Constantes
const KEYCODE = {
  ESC: 27,
  LEFT: 37,
  RIGHT: 39
};

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const galleries = document.querySelectorAll(".gallery");
  const loadingSpinner = document.querySelector(".loading-spinner");
  let currentImageIndex = 0;
  let currentGalleryImages = [];

  // Função para ativar uma aba e sua galeria correspondente
  function activateTab(button) {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    galleries.forEach((gallery) => gallery.classList.remove("active"));

    button.classList.add("active");
    const activeGallery = document.getElementById(button.dataset.tab);
    activeGallery.classList.add("active");
    
    // Atualiza a lista de imagens da galeria atual
    currentGalleryImages = Array.from(activeGallery.querySelectorAll("img"));
  }

  // Adiciona o evento de clique a cada botão
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => activateTab(button));
  });

  // Função para mostrar loading spinner
  function showLoading() {
    loadingSpinner.style.display = "block";
  }

  // Função para esconder loading spinner
  function hideLoading() {
    loadingSpinner.style.display = "none";
  }

  // Função para abrir o modal
  function openModal(imageUrl, index) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImg");
    currentImageIndex = index;
    
    showLoading();
    modalImg.onload = () => hideLoading();
    modalImg.onerror = () => {
      hideLoading();
      alert("Erro ao carregar a imagem");
    };
    
    modal.style.display = "block";
    modalImg.src = imageUrl;
  }

  // Função para navegar entre imagens
  function navigateImage(direction) {
    currentImageIndex = (currentImageIndex + direction + currentGalleryImages.length) % currentGalleryImages.length;
    const newImage = currentGalleryImages[currentImageIndex];
    openModal(newImage.src, currentImageIndex);
  }

  // Função para fechar o modal
  function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  // Eventos de teclado para navegação
  document.addEventListener("keydown", (event) => {
    if (document.getElementById("myModal").style.display === "block") {
      switch(event.keyCode) {
        case KEYCODE.ESC:
          closeModal();
          break;
        case KEYCODE.LEFT:
          navigateImage(-1);
          break;
        case KEYCODE.RIGHT:
          navigateImage(1);
          break;
      }
    }
  });

  // Fechar o modal ao clicar fora da imagem
  window.onclick = function (event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
      closeModal();
    }
  };

  // Adiciona evento de clique às imagens para abrir o modal
  document.querySelectorAll(".gallery img").forEach((img, index) => {
    img.addEventListener("click", () => openModal(img.src, index));
    
    // Tratamento de erro para imagens
    img.onerror = function() {
      this.src = "caminho/para/imagem/erro.jpg"; // Adicione uma imagem de fallback
      this.alt = "Imagem não disponível";
    };
  });

  // Adiciona suporte a gestos touch para o modal
  let touchStartX = 0;
  let touchEndX = 0;

  document.querySelector('.modal-content').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.querySelector('.modal-content').addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe direita
        showPreviousImage();
      } else {
        // Swipe esquerda
        showNextImage();
      }
    }
  }

  function showPreviousImage() {
    navigateImage(-1);
  }

  function showNextImage() {
    navigateImage(1);
  }

  // Fecha a sidebar em dispositivos móveis após clicar em uma tab
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('.tabs').style.maxHeight = '40px';
        setTimeout(() => {
          document.querySelector('.tabs').style.maxHeight = '40vh';
        }, 100);
      });
    });
  }
});
