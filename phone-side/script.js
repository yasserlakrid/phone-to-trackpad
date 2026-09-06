
const ws = new WebSocket("ws://10.189.188.145:7878");
ws.onopen = ()=> console.log("Connected to server")
ws.onclose   = ()=> console.log("Disconnected from server");
ws.onerror = (e)=> console.log("Error: ", e);

let trackpad = document.querySelector(".touch");
let leftBtn = document.querySelector(".left-btn");
let rightBtn = document.querySelector(".right-btn")
ws.addEventListener('open', () => {
     
let lastX = null;
let lastY = null;

trackpad.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
});

trackpad.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - lastX;
    const dy = touch.clientY - lastY;

    ws.send(JSON.stringify({ dx, dy }));

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