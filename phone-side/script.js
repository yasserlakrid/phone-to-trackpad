
const ws = new WebSocket("ws://10.189.188.145:7878");
ws.onopen = ()=> console.log("Connected to server")
ws.onclose   = ()=> console.log("Disconnected from server");
ws.onerror = (e)=> console.log("Error: ", e);

let trackpad = document.querySelector(".touch");
let leftBtn = document.querySelector(".left-btn");
let rightBtn = document.querySelector(".right-btn")
ws.addEventListener('open', () => {
     
trackpad.addEventListener("touchmove", (e) => {
    e.preventDefault();
    let dx = e.targetTouches[0].clientX;
    let dy = e.targetTouches[0].clientY;
    console.log(JSON.stringify({ type: "move", dx, dy }));
    ws.send(JSON.stringify({ type: "move", dx, dy }));
})

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