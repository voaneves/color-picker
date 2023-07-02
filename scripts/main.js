function runColorPicker() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const h1 = document.getElementById("hex");

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

  const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gradients.forEach(({ x0, y0, x1, y1, stops }) => {
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach((color, index) =>
        gradient.addColorStop(index / (stops.length - 1), color)
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    });
  };

  const adjustHexPosition = (x, y) => {
    const maxX = window.innerWidth - 1.2 * h1.offsetWidth;
    const maxY = window.innerHeight - 1.5 * h1.offsetHeight;
    const adjustedX = Math.max(0, Math.min(x, maxX));
    const adjustedY = Math.max(0, Math.min(y, maxY));
    return { x: adjustedX, y: adjustedY };
  };

  const invertColor = (color) => {
    const hexValue = color.substring(1);
    const invertedHex = (0xffffff ^ parseInt(hexValue, 16))
      .toString(16)
      .padStart(6, "0");
    return "#" + invertedHex;
  };

  const handleMouseMove = (event) => {
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
    h1.style.top = `${adjustedY}px`;
  };

  const handleCopy = (hexValue) => {
    navigator.clipboard.writeText(hexValue);
    const m = document.getElementById("copied");
    m.querySelector("h1").textContent = hexValue;
    m.style.color = invertColor(hexValue);
    m.style.background = hexValue;
    m.classList.add("appear");
    setTimeout(() => {
      m.classList.remove("appear");
      canvas.style.cursor = "crosshair";
    }, 3001);
  };

  const handleClick = ({ target }) => {
    const hexValue = h1.textContent;
    target.style.cursor = "not-allowed";
    handleCopy(hexValue);
  };

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("click", handleClick);
  window.addEventListener("resize", setCanvasSize);

  setCanvasSize();
}

runColorPicker();
