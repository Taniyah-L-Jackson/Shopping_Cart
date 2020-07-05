import React, { useState } from 'react'
import ShopList from './shopList'; //items available in store

//For displaying cart
function Inventory(props) {
  return (
    <>
      {/* Display inventory */}
      {ShopList.map(items => {return (
        <div className="col-sm-6 itemBox" key={items.id}>
          <h2 className='itemTitle'>{items.name}</h2>
          <h3 className='itemPrice'>${(items.price).toFixed(2)}</h3>
          <img className= 'img-responsive itemImg' src={items.img} alt={items.name}/>
          <button className='add' onClick={() => props.addItem(items)}>Add</button> {/*passing elements to function*/}
          <button className='remove' onClick={() => props.deleteItem(items)}>Remove</button> {/*passing elements to function*/}
        </div>
        )}
      )}
    </>
  )
}

//For displaying cart
function ShowCart(props) {
  return (
    <div className='inCart'>
      <h4>{props.item.name}</h4>
      <ul>
        <li>Price: ${props.item.price}</li>
        <li>Qty: {props.item.qty}</li>
      </ul>
    </div>
  )
}

//For empty cart
function Empty() {
  return (
    <div>
      <h1 className='empty'>Nothing in Cart</h1>
    </div>
  )
}

function App() {

  const [ cart, setCart ] = useState([]) //store items
  const [ total, setTotal ] = useState(0) //total price of items in cart

  //Adding item
  const addItem = (items) => {

    let found = false //check for item in cart
    const newItem = {
      id: items.id, 
      name: items.name, 
      price: items.price,
      inStock: (items.available - 1), //for every item added, stock is decreased by 1 
      qty: 1
    } //get new item, qty auto-set to 1


    if (cart.length === 0) { //add item if cart is empty

      const updateList = [...cart, newItem] //copy original list and add new item (prevents overwriting)
      setCart(updateList) //update cart
      setTotal(total + newItem.price) //update total

    } else { //if cart is not empty

      cart.forEach(cartItem => { //cart check

        if (cartItem.id === items.id) { //if item is already in cart

          if(cartItem.inStock === 0) { //stop if item has empty stock
            alert('Out Of Stock!!')
            found = true //(prevents adding items with same key)
            return cartItem 

          }else { //continue if item's stock is not empty
            cartItem.qty += 1
            cartItem.inStock -= 1 //for when cart is not empty
            found = true //item found
            setTotal(total + cartItem.price)
          }

        }          
        return cartItem
      })

      if(!found) { //another new item

        const updateList = [...cart, newItem] 
        setCart(updateList)
        setTotal(total + newItem.price)
      }

    }

  }

  //Removing item
  const deleteItem = (items) => {

    cart.map(cartItem => {

      if (cartItem.id === items.id) { //if item is already in cart
        cartItem.qty -= 1 //update qty of item
        cartItem.inStock += 1 //re-stock item (fully re-stocked when qty reaches 0)
        setTotal(total - cartItem.price) //update total
      }

      if (cartItem.qty === 0) { //remove if qty of item is 0
        const filterCart = cart.filter(item => item.qty > 0)
        setCart(filterCart)
      }

      return cartItem
    })
  }

  //show text when the cart is either empty or not empty
  const displayCart = cart.length === 0 ? <Empty/> : cart.map(item => {
    return <ShowCart key={item.id} item={item}/>})

  return (
    <div className='bg'>
      <div className="container">

        {/* Inventory */}
        <div className="row">
          <div className="col-sm-6">

            <div className="row">
              <div className="col-sm-12 noPadding">
                <h1 className='inventory'>Inventory</h1>
              </div>
            </div>

            <div className="row box">
              <Inventory addItem={addItem} deleteItem={deleteItem}/>  {/*show inventory*/}
            </div>
          </div>

          <div className="col-sm-5 float">

            {/* Cart */}
            <div className="row cartRow">
              <div className="col-sm-12 cartList">
                <h1>In Cart: </h1>
                <hr className='line'/>
                <div className='cartBox'>{displayCart}</div> {/* Show cart */}
              </div>
            </div>

            {/* Total */}
            <div className="row">
              <div className="col-sm-12 noPadding">
                <h1 className='total'>Total: ${(total).toFixed(2)}</h1> {/*Display total*/}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
