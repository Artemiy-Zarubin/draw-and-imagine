document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  canvas.width = 500;
  canvas.height = 500;
  const context = canvas.getContext("2d");
  const colorInput = document.getElementById("color");
  let sizeInput = document.getElementById("size");
  const undoButton = document.getElementById("undoBtn");
  const clearButton = document.getElementById("clearBtn");
  let isDrawing = false;
  let undoStack = [];

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);
  undoButton.addEventListener("click", undoLastDraw);
  clearButton.addEventListener("click", clearCanvas);
  document.addEventListener("keydown", handleKeyDown);

  function startDrawing(event) {
    isDrawing = true;
    draw(event);
  }
  function draw(event) {
    if (!isDrawing) return;
    if(sizeInput.value > 50) sizeInput.value = 50;
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    context.fillStyle = colorInput.value;
    context.beginPath();
    context.arc(x, y, sizeInput.value, 0, 2 * Math.PI);
    context.fill();

    undoStack.push({ x, y, color: colorInput.value, size: sizeInput.value });

    if (undoStack.length > 100) {
      undoStack.shift(); // Удаляем самый старый элемент, если превышен лимит
    }
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function undoLastDraw() {
    console.log(undoStack.length);
    if (undoStack.length > 0) {
      undoStack.pop(); // Удаляем последний элемент из буфера
      clearCanvas();
      redraw();
      console.log(undoStack.length);
  }
  }
  function redraw() {
    undoStack.forEach(({ x, y, color, size }) => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.fill();
    });
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function handleKeyDown(event) {
    if (event.key === "z") {
      undoLastDraw();
    }
  }
});
