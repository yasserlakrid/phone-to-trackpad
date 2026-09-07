
console.log("🔥 SCRIPT LOADED");
const ws = new WebSocket("ws://10.107.94.145:7878");
ws.onopen = ()=> console.log("Connected to server")
ws.onclose   = ()=> console.log("Disconnected from server");
ws.onerror = (e)=> console.log("Error: ", e);

let trackpad = document.querySelector(".touch");
let leftBtn = document.querySelector(".left-btn");
let rightBtn = document.querySelector(".right-btn")
ws.addEventListener('open', () => {
     
let lastX = null;
let lastY = null;
let dx = 0;
let dy = 0;
let framePending = false;

function flushMovement() {
    framePending = false;

    if (dx === 0 && dy === 0) {
        return;
    }

    ws.send(JSON.stringify({ dx, dy }));
    dx = 0;
    dy = 0;
}

trackpad.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
});

trackpad.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const dxnow = touch.clientX - lastX;
    const dynow = touch.clientY - lastY;
    dx += dxnow;
    dy += dynow;

    if (!framePending) {
        framePending = true;
        requestAnimationFrame(flushMovement);
    }

    // update reference point to THIS event, not the original touchstart
    lastX = touch.clientX;
    lastY = touch.clientY;
   
});
 

trackpad.addEventListener("click", (e) => {
    e.preventDefault();
    ws.send(JSON.stringify({ move_type: "left click" }));
    })

rightBtn.addEventListener("click" , (e)=> {
    e.preventDefault()
    ws.send(JSON.stringify({ move_type: "right click" }))
})
leftBtn.addEventListener("click" , (e)=> {
    e.preventDefault()
    ws.send(JSON.stringify({ move_type: "left click" }))
})

}) 