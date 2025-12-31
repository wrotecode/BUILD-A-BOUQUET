
function loadFlowers() {
  const mainContainer = document.getElementById("mainFlowers");
  const supportContainer = document.getElementById("supportFlowers");

  mainFlowers.forEach(flower => {
    const div = document.createElement("div");
    div.classList.add("flower-option");
    div.innerHTML = `<img src="${flower.image}" alt="${flower.name}"><p>${flower.name}</p>`;
    div.addEventListener("click", () => selectFlower(div, flower.name, "main"));
    mainContainer.appendChild(div);
  });

  supportFlowers.forEach(flower => {
    const div = document.createElement("div");
    div.classList.add("flower-option");
    div.innerHTML = `<img src="${flower.image}" alt="${flower.name}"><p>${flower.name}</p>`;
    div.addEventListener("click", () => selectFlower(div, flower.name, "support"));
    supportContainer.appendChild(div);
  });
}

let selectedMain = "";
let selectedSupport = "";

function selectFlower(element, flowerName, type) {
  const container = type === "main"
    ? document.getElementById("mainFlowers")
    : document.getElementById("supportFlowers");

  container.querySelectorAll(".flower-option").forEach(opt => opt.classList.remove("selected"));
  element.classList.add("selected");

  if (type === "main") selectedMain = flowerName;
  else selectedSupport = flowerName;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const message = document.getElementById("userMessage").value.trim();
  const preview = document.getElementById("bouquetPreview");

  if (!selectedMain || !selectedSupport) {
    preview.innerHTML = `
      <div class="bouquet-card">
        <p style="color: #e74c3c; font-weight: 600;">Please select both main and support flowers 🌸</p>
      </div>
    `;
    return;
  }

  const fileName = `${selectedMain.toLowerCase()} and ${selectedSupport.toLowerCase()}.png`;
  const imagePath = `images/bouquet_images/${fileName}`;

  preview.innerHTML = `
    <div class="bouquet-card" id="bouquetCard">
      <img src="${imagePath}" alt="Bouquet">
      <h3>${selectedMain} + ${selectedSupport}</h3>
      ${message ? `<div class="message">"${message}"</div>` : ''}
    </div>
  `;

  document.getElementById("downloadBtn").style.display = "block";
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const bouquetCard = document.querySelector(".bouquet-card");

  if (!bouquetCard) return;

  // Clone the bouquet card for clean export
  const downloadContainer = document.createElement("div");
  downloadContainer.style.cssText = `
    background: #fff;
    padding: 40px;
    display: inline-block;
    font-family: 'Poppins', sans-serif;
  `;

  const clonedCard = bouquetCard.cloneNode(true);

  // Recursively clean all children from foggy CSS
  function cleanElement(el) {
    // Don't apply white background to IMG elements to prevent foggy appearance
    if (el.tagName !== 'IMG') {
      el.style.background = "#fff";
    }
    el.style.backdropFilter = "none";
    el.style.filter = "none";
    el.style.opacity = "1";
    el.style.boxShadow = "none";
    el.style.border = "none";
    el.style.textShadow = "none";

    if (el.children.length > 0) {
      Array.from(el.children).forEach(child => cleanElement(child));
    }
  }

  cleanElement(clonedCard);
  downloadContainer.appendChild(clonedCard);

  // Place offscreen
  document.body.appendChild(downloadContainer);
  downloadContainer.style.position = "absolute";
  downloadContainer.style.left = "-9999px";

  // High-resolution render
  const scaleFactor = window.devicePixelRatio * 3;

  html2canvas(downloadContainer, {
    backgroundColor: "#fff",
    scale: scaleFactor,
    useCORS: true,
    logging: false,
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = `${selectedMain}_${selectedSupport}_bouquet.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
    document.body.removeChild(downloadContainer);
  }).catch(error => {
    console.error("Download failed:", error);
    document.body.removeChild(downloadContainer);
  });
});


// ✨ Page Load Animation
window.onload = () => {
  loadFlowers();

  const elements = document.querySelectorAll('.flower-section, .message-section');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';

    setTimeout(() => {
      el.style.transition = 'all 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 200);
  });
};
