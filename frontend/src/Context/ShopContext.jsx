import React,{createContext, useEffect, useState}from "react";






export const ShopContext = createContext(null);
const url = "https://jshop-backend.onrender.com"
const getDefaultCart = ()=>{
    let cart = {};
    for(let index =0; index< 300+1; index++){
        cart[index]=0;
    }
    return cart;
}
const ShopContextProvider = (props) =>{
    const[all_product,setAll_Product]=useState([]);
    const[cartItems, setCartItems] = useState(getDefaultCart());
    useEffect(()=>{
         fetch('https://jshop-backend.onrender.com/allproducts')
         .then((response)=>response.json())
         .then((data)=>setAll_Product(data))
         if(localStorage.getItem('auth-token')){
            fetch('https://jshop-backend.onrender.com/getcart',{
                method:'GET',
               headers:{
                Accept:'application/form-data',
                'Authorization': `Bearer ${'auth-token'}`, 
                'Content-Type':'application/json',
            },  
            body: JSON.stringify({}),
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
         }
    },[])
    
    const addToCart = (itemId)=>{
       
        console.log(cartItems);
        if(localStorage.getItem('auth-token')){
             setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
            fetch('https://jshop-backend.onrender.com/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})

            })
            .then((response)=>response.json())
            .then((data)=>console.log(data))
        }
        else {
        // If the user is not logged in, alert them to log in first
        console.log("Please log in to add items to the cart.");
    }
    }

    const removeFromCart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if (localStorage.getItem('auth-token')) {
            fetch('https://jshop-backend.onrender.com/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },  
                body:JSON.stringify({"itemId":itemId})

            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
            
        }
        
    }


    const getTotalCartAmount=()=>{
        let totalAmount =0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product)=>product.id===Number(item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
            
        }
        return totalAmount;
    }

    const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem +=cartItems[item];
            }
        }
        return totalItem;
    }
    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}


export default ShopContextProvider
