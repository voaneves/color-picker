(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const h1 = document.getElementById("hex");
  const copiedMessage = document.getElementById("copied");
  const canvasStyle = canvas.style;

  const gradients = [
    {
      x0: 0,
      y0: 0,
      x1: window.innerWidth,
      y1: 0,
      stops: [
        "rgb(255, 0, 0)",
        "rgb(255, 0, 255)",
        "rgb(0, 0, 255)",
        "rgb(0, 255, 255)",
        "rgb(0, 255, 0)",
        "rgb(255, 255, 0)",
        "rgb(255, 0, 0)",
      ],
    },
    {
      x0: 0,
      y0: 50,
      x1: 0,
      y1: window.innerHeight - 50,
      stops: [
        "rgba(255, 255, 255, 1)",
        "rgba(255, 255, 255, 0)",
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 1)",
      ],
    },
  ];

  function setCanvasSize() {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gradients.forEach(({ x0, y0, x1, y1, stops }) => {
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach((color, index) =>
        gradient.addColorStop(index / (stops.length - 1), color)
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, innerWidth, innerHeight);
    });
  }

  function adjustHexPosition(x, y) {
    const { offsetWidth, offsetHeight } = h1;
    const maxX = window.innerWidth - 1.2 * offsetWidth;
    const maxY = window.innerHeight - 1.2 * offsetHeight;
    const adjustedX = Math.max(0, Math.min(x, maxX));
    const adjustedY = Math.max(0, Math.min(y, maxY));
    return { x: adjustedX, y: adjustedY };
  }

  function invertColor(color) {
    const hexValue = color.substring(1);
    const invertedHex = (0xffffff ^ parseInt(hexValue, 16))
      .toString(16)
      .padStart(6, "0");
    return "#" + invertedHex;
  }

  function handleMouseMove(event) {
    const { pageX: x, pageY: y } = event;
    const { data } = ctx.getImageData(x, y, 1, 1);
    const hexValue =
      "#" +
      Array.from(data.slice(0, 3), (val) =>
        val.toString(16).padStart(2, "0")
      ).join("");

    const { x: adjustedX, y: adjustedY } = adjustHexPosition(x, y);
    h1.textContent = hexValue;
    h1.style.color = invertColor(hexValue);
    h1.style.left = `${adjustedX + 25}px`;
    h1.style.top = `${adjustedY + 10}px`;
  }

  function handleCopy(hexValue) {
    navigator.clipboard.writeText(hexValue).then(() => {
      const style = copiedMessage.style;
      style.color = invertColor(hexValue);
      style.background = hexValue;
      copiedMessage.querySelector("h1").textContent = hexValue;
      copiedMessage.classList.add("appear");
      setTimeout(() => {
        copiedMessage.classList.remove("appear");
        canvasStyle.cursor = "crosshair";
      }, 3001);
    });
  }

  function handleClick(event) {
    const hexValue = h1.textContent;
    event.target.style.cursor = "not-allowed";
    handleCopy(hexValue);
  }

  function initializeModal() {
    const modal = document.getElementById("modal-one");
    const isModalDismissed =
      JSON.parse(localStorage.getItem("isModalDismissed")) || false;

    const closeModal = () => {
      localStorage.setItem("isModalDismissed", JSON.stringify(true));
      modal.classList.remove("open");
    };

    const handleModalClick = (event) => {
      if (event.target.classList.contains("modal-exit")) {
        closeModal();
      }
    };

    if (!isModalDismissed) {
      modal.classList.add("open");
      modal.addEventListener("click", handleModalClick);
    }
  }

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("click", handleClick);
  window.addEventListener("resize", setCanvasSize);

  setCanvasSize();
  initializeModal();
})();
