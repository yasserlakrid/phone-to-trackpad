use std::net::TcpListener;
use std::io::Read;
use tungstenite::{accept, Message};
use serde::{Serialize, Deserialize};
use serde_json;
use enigo::{Enigo, Mouse, Settings, Coordinate, Button, Direction::{Press, Release, Click} };
#[derive(Deserialize , Debug)]
struct MoveInput {
    move_type : Option<String> , 
    dx : Option<i32> , 
    dy : Option<i32> 

}
fn print_type<T>(_: &T) {
    println!("{}", std::any::type_name::<T>());
}
fn main() {

let listener = TcpListener::bind("0.0.0.0:7878").expect("Failed to bind to address");
println!("Server listening on port 7878");
for stream in listener.incoming() {
    println!("new connection came"); 
    match stream {
        Ok(mut stream) => {
            println!("New connection: {}", stream.peer_addr().unwrap());
            // Handle the connection in a separate thread or async task
            std::thread::spawn(move || {
                let mut enigo = Enigo::new(&Settings::default()).unwrap(); 

              let mut websocket =   match accept(stream) {
                    Ok(ws) =>{ println!("hanshaked") ; ws },
                    Err(_err) => {println!("handshake failed"); return ; }
                 };
                 loop {
                    let mut message =  MoveInput {
                        move_type : None , dx: None , dy : None 
                    };                     
                    match websocket.read() {
                        Ok(Message::Text(text))=>{ message = serde_json::from_str(&text).unwrap(); },
                        Ok(Message::Binary(data)) => {},
                        Ok(Message::Close(_)) => { },
                        Ok(Message::Ping(_)) | Ok(Message::Pong(_)) => { },
                        Ok(Message::Frame(_)) => {}
                        Err(err) => { break;
                            
                        }
                    };
                    
                    
                    match message.move_type{
                        Some(value) => {
                            println!("{value}" );
                            if value == "move".to_string() {
                                enigo.move_mouse(message.dx.unwrap() , message.dy.unwrap() , Coordinate::Abs).unwrap();
                            }else if value == "left click".to_string() {
                                enigo.button(Button::Left , Click).unwrap();
                            }else  {
                                enigo.button(Button::Right , Click).unwrap();
                            }

                        },                            
                       
                       
                            
                        None=>{

                        }

                        
                    }                     
                 }

                
            });
        }
        Err(e) => {
            println!("Connection failed: {}", e);
        }
    };
    }; 
}
