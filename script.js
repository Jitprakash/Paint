const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const toolBtn = document.querySelectorAll(".tool");
const fill_color = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtn = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvasBtn = document.querySelector(".clear-canvas");
const saveImgBtn = document.querySelector(".save-img");
//Global VAriable With default values
let selectedTool = "brush";
let isDrawing = false;
let brushWidth = 5;
let prevMouseX;
let prevMouseY;
let snapshot;
let selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    //Settinng Canvas Width  /  height ... offsetWidth/height returns a vieable height and width of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRectangle = (e) => {

    if (!fill_color.checked) {

        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);// It draws a rectangle no fill
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);// It draws a rectangle with fill color

}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);//it is used to draw circle
    fill_color.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);// Moving the Triangle to mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);//Creating First line of ttriangle
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);//Creating buttom line of Triangle
    ctx.closePath(); // Closing the triangle
    fill_color.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true
    ctx.beginPath();// Create a new Path to Draw
    ctx.lineWidth = brushWidth; // Passing brushSize as line Width
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);//to avoid draging the shape
}

const drawing = (e) => {
    if (!isDrawing) return; // If dreawing is false return from here

    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#edf6f9" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);//X and Y axis to draw the line
        ctx.stroke();//Fill  the line with color
    } else if (selectedTool === "rectangle") {
        drawRectangle(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        //Remove active class from others
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");//Add active class to the pressed button
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});


colorBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        //Remove selected class from others
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");//Add selected class to the pressed button
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
})


sizeSlider.addEventListener("change", () => { brushWidth = sizeSlider.value; }); // Passing Slider value as brush size

clearCanvasBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImgBtn.addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => { isDrawing = false });
canvas.addEventListener("mousemove", drawing);