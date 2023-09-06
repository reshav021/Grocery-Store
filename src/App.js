import "./App.css";
import productsData from "./productsData.json";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const allProducts = productsData;   // Store data from json file
  const [totalCost, setTotalCost] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartProducts, setCartProducts] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [displayCheckoutPage, setdisplayCheckoutPage] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCloseSelectedItemDiv = () => {
    setSelectedProduct(null);
  }

  let [displayFruitsVeg, setDisplayFruitsVeg] = useState(true);
  let [displayChocoBiscuit, setDisplayChocoBiscuit] = useState(false);
  let [displayDairyBreadEggs, setDisplayDairyBreadEggs] = useState(false);
  let [displayColdDrinksIcecream, setDisplayColdDrinksIcecream] = useState(false);
  
  let [displayAllProducts, setDisplayAllProducts] = useState(false);

  const handleDisplayFruitsVeg = () => {
    setSelectedProduct(null);
    setDisplayChocoBiscuit(false);
    setDisplayDairyBreadEggs(false);
    setDisplayColdDrinksIcecream(false);
    setDisplayFruitsVeg(true);
    setDisplayAllProducts(false);
    setdisplayCheckoutPage(false);
  };

  const handleDisplayChocoBiscuit = () => {
    setSelectedProduct(null);
    setDisplayFruitsVeg(false);
    setDisplayDairyBreadEggs(false);
    setDisplayColdDrinksIcecream(false);
    setDisplayChocoBiscuit(true);
    setDisplayAllProducts(false);
    setdisplayCheckoutPage(false);
  };

  const handleDisplayDairyBreadEggs = () => {
    setSelectedProduct(null);
    setDisplayFruitsVeg(false);
    setDisplayChocoBiscuit(false);
    setDisplayColdDrinksIcecream(false);
    setDisplayDairyBreadEggs(true);
    setDisplayAllProducts(false);
    setdisplayCheckoutPage(false);
  };

  const handleDisplayColdDrinksIcecream = () => {
    setSelectedProduct(null);
    setDisplayFruitsVeg(false);
    setDisplayChocoBiscuit(false);
    setDisplayDairyBreadEggs(false);
    setDisplayColdDrinksIcecream(true);
    setDisplayAllProducts(false);
    setdisplayCheckoutPage(false);
  };

  const handleSearchItem = (event) => {
    setdisplayCheckoutPage(false);
    setdisplayContainer(true);
    
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if(searchValue.length > 0) {
      setDisplayFruitsVeg(false);
      setDisplayChocoBiscuit(false);
      setDisplayDairyBreadEggs(false);
      setDisplayColdDrinksIcecream(false);
      setDisplayAllProducts(true);
    } 
    else {
      setDisplayFruitsVeg(true);
      setDisplayChocoBiscuit(false);
      setDisplayDairyBreadEggs(false);
      setDisplayColdDrinksIcecream(false);
      setDisplayAllProducts(false);
    }
  };

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productDetailsRef = useRef(null);
  const cartPopupRef = useRef(null);

  const handleCartClick = (event) => {
    event.stopPropagation();
    setShowCartPopup(!showCartPopup);
  };

  const handleCart = (id, image, name, price, category, quantityVal) => {
    const existingProductIndex = cartProducts.findIndex(
      (product) => product.id === id
    );

    if(existingProductIndex !== -1) {
      // If the product already exists
      const updatedCartProducts = [...cartProducts];
      updatedCartProducts[existingProductIndex].quantity++;
      setCartProducts(updatedCartProducts);
    } else {
      const newCartItem = { id, image, name, price, category, quantity: 1, quantityVal };
      setCartProducts((prevCartProducts) => [...prevCartProducts, newCartItem]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.filter((product) => product.id !== productId)
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartPopupRef.current && !cartPopupRef.current.contains(event.target)) {
        setShowCartPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Remove products with quantity === 0 from the cart
    setCartProducts((prevCartProducts) => prevCartProducts.filter((product) => product.quantity > 0));

    // Recalculate the total cost after removing products with zero quantity
    const totalCost = cartProducts.reduce((total, product) => total + Number(product.price) * product.quantity, 0);
    setTotalCost(totalCost);
  }, [cartProducts]);

  useEffect(() => {
    const totalCost = cartProducts.reduce((total, product) => total + Number(product.price) * product.quantity, 0);
    setTotalCost(totalCost);

    // Remove products with quantity === 0 from the cart
    setCartProducts((prevCartProducts) =>
      prevCartProducts.filter((product) => product.quantity > 0)
    );
  }, [cartProducts]);

  const handleDecQuantity = (productId) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      })
    );
  };

  const handleIncQuantity = (productId) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      })
    );
  };

  const renderProduct = (product, category) => (
    <div className="productDesc" key={product.id} onClick={() => setSelectedProduct(product)}>
      <img id="productImg" src={product.image[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p id="itemPrice">₹{product.price}</p>
  
      {cartProducts.some((cartProduct) => cartProduct.id === product.id) ? (
        cartProducts.find((cartProduct) => cartProduct.id === product.id).quantity > 0 ? (
          <div className="incDecQuantity">
            <button id="decQuantity" onClick={() => handleDecQuantity(product.id)} className="circleButton"> - </button>
            <p id="quantity"> {cartProducts.find((cartProduct) => cartProduct.id === product.id)?.quantity || 0} </p>
            <button id="incQuantity" onClick={() => handleIncQuantity(product.id)} className="circleButton"> + </button>
          </div>
        ) : (
          <button id="removeFromCartBtn" onClick={() => handleRemoveFromCart(product.id)}> Remove from Cart </button>
        )
      ) : (
        <p></p>
      )}
    </div>
  );

  // Event handler for closing product details when clicking outside
  const handleClickOutsideProductDetails = (event) => {
    if (
      productDetailsRef.current &&
      !productDetailsRef.current.contains(event.target) &&
    
      event.target.id !== "cart-logo" &&
      cartPopupRef.current && // Check if cartPopupRef exists before accessing contains
      !cartPopupRef.current.contains(event.target)
    ) {
      handleCloseSelectedItemDiv();
    }
  };
  
  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutsideProductDetails);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProductDetails);
    };
  }, []);

  const [quantityVal, setQuantity] = useState('');

  const handleHeaderClick = () => {
    setSelectedProduct(null);
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = (selectedProduct) => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProduct.image.length) % selectedProduct.image.length);
  };

  const nextImage = (selectedProduct) => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProduct.image.length);
  };

  const [displayContainer, setdisplayContainer] = useState(true);

  const handleCheckoutPage = () => {
    setdisplayContainer(false);
    setDisplayAllProducts(false);
    setdisplayCheckoutPage(true);
  }

  const renderCartDetails = (
    <div className="renderCart">
      {cartProducts.length > 0 ? (
        cartProducts.map((product) => (
          <div key={product.id} className="cartDetails">
            <img id="cartProductImg" src={product.image[0]} alt={product.name} />
            <p id="cartProductName">{product.name}</p>
            <p id="selectedSize">Quantity: {quantityVal}</p>

            {product.quantity > 0 ? (
              <div className="incDecQuantity">
                <button id="decQuantity" onClick={() => handleDecQuantity(product.id)} className="circleButton"> - </button>
                <p id="quantity">{product.quantity}</p>
                <button id="incQuantity" onClick={() => handleIncQuantity(product.id)} className="circleButton"> + </button>
              </div>
            ) : (
              <button id="removeFromCartBtn" onClick={() => handleRemoveFromCart(product.id)}> Remove from Cart </button>
            )}
            <p id="cartProductPrice">₹{product.price}</p>
          </div>
        ))
      ) : (
        <p>No products in the cart.</p>
      )}

      {cartProducts.length > 0 && (
        <div className="totalPrice">
          <h3>Total Price: ₹{totalCost}</h3>
        </div>
      )}
    </div>
  )
  
  return (
    <div className="app">
      <div className="header" onClick={handleHeaderClick}>
        <p id="logo">Grocery Store</p>
        <input id="searchItem" placeholder="Search Product" onChange={handleSearchItem} />

        <div id="cart-logo" onClick={handleCartClick}> Cart </div>
        {showCartPopup && (
          <div ref={cartPopupRef} id="cart-popup" className="cart-popup" >
            <div className="cart-content">
              {renderCartDetails}
              <button id="buynowBtn" onClick={handleCheckoutPage}>Buy Now</button>
            </div>
          </div>
        )}
      </div>

      <div className="container">
        {displayContainer && (
          <div className="shoppingItem">
            <div className="allItemsBtn">
              <button id="fruitsVegBtn" className={displayFruitsVeg ? "fruitsVegActive" : ""} onClick={handleDisplayFruitsVeg}> Fruits & Vegetables </button>
              <button id="chocolateBiscuitBtn" className={displayChocoBiscuit ? "chocoBiscuitActive" : ""} onClick={handleDisplayChocoBiscuit}> Chocolate & Biscuits </button>
              <button id="dairyBreadEggsBtn" className={displayDairyBreadEggs ? "dairyBreadEggsActive" : ""} onClick={handleDisplayDairyBreadEggs}> Dairy, Bread & Eggs </button>
              <button id="coldDrinksIcecreamBtn" className={displayColdDrinksIcecream ? "coldDrinksIcecreamActive" : ""} onClick={handleDisplayColdDrinksIcecream}> ColdDrinks & Icecream </button>
            </div>

            {displayAllProducts && (
              <div className="allProducts">
                {filteredProducts.map((product) => (
                  renderProduct(product, product.category)
                ))}
              </div>
            )}

            {displayFruitsVeg && (
              <div className="fruitsVeg">
                {filteredProducts
                  .filter((product) => product.category === "fruitsVeg")
                  .map((product) => (
                    renderProduct(product, "fruitsVeg")
                  ))}
              </div>
            )}

            {displayChocoBiscuit && (
              <div className="chocoBiscuit">
                {filteredProducts
                  .filter((product) => product.category === "chocoBiscuit")
                  .map((product) => (
                    renderProduct(product, "chocoBiscuit")
                  ))}
              </div>
            )}

            {displayDairyBreadEggs && (
              <div className="dairyBreadEggs">
                {filteredProducts
                  .filter((product) => product.category === "dairyBreadEggs")
                  .map((product) => (
                    renderProduct(product, "dairyBreadEggs")
                  ))}
              </div>
            )}

            {displayColdDrinksIcecream && (
              <div className="coldDrinksIcecream">
                {filteredProducts
                  .filter((product) => product.category === "coldDrinksIcecream")
                  .map((product) => (
                    renderProduct(product, "coldDrinksIcecream")
                  ))}
              </div>
            )}
          </div>
        )}

        {displayCheckoutPage && (
          <div className="checkoutPage">
            <div>{renderCartDetails}</div>
            
            <div>
              <h2>Checkout</h2>
              <form>
                <div class="form-group">
                  <input type="text" id="fullName" name="fullName" placeholder="Full Name" required />
                  <input type="email" id="email" name="email" placeholder="Email" required />
                  <input type="text" id="address" name="address" placeholder="Address" required />
                  <input type="text" id="city" name="city" placeholder="City" required />
                  <input type="text" id="zipCode" name="zipCode" placeholder="ZIP code" required />
                  <input type="text" id="phoneno" name="phoneNo" placeholder="Phone Number" required />
                  <button type="submit">Place Order</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div ref={productDetailsRef} className="product-details">
          <div className="detailedProductImageDiv">
            <button id="prevImg" onClick={() => {prevImage(selectedProduct)}}><h1>&#60;</h1></button>
            <img id="detailedProductImg" src={selectedProduct.image[currentImageIndex]} alt="Product Image" className="detailed-product-img" />
            <button id="nextImg" onClick={() => {nextImage(selectedProduct)}}><h1>&#62;</h1></button>           
          </div>

          <div className="inner-product-details">
            <h1>{selectedProduct.name}</h1>
            <h2>₹{selectedProduct.price}</h2>

            {selectedProduct.category === "fruitsVeg" ? (
              <div className="quantity">
                <button id="fruitVegQuantity" className={quantityVal === '1kg' ? 'selected' : ''} onClick={(e) => setQuantity('1kg')}>1kg</button>
              </div>
            ) : selectedProduct.category === "chocoBiscuit" ? (
              <div className="quantity"></div>
            ) : selectedProduct.category === "dairyBreadEggs" ? (
              <div className="quantity"></div>
            ) : selectedProduct.category === "coldDrinksIcecream" ? (
              <div className="quantity"></div>
            ): null}

            <h4 id="description">Description</h4>
            <p>{selectedProduct.description}</p>

            {cartProducts.some((cartProduct) => cartProduct.id === selectedProduct.id) ? (
              cartProducts.find((cartProduct) => cartProduct.id === selectedProduct.id).quantity > 0 ? (
                <div className="detailedIncDecQuantity">
                  <button id="detailedDecQuantity" onClick={() => handleDecQuantity(selectedProduct.id)} className="circleButton"> - </button>
                  <p id="detailedQuantity"> {cartProducts.find((cartProduct) => cartProduct.id === selectedProduct.id)?.quantity || 0} </p>
                  <button id="detailedIncQuantity" onClick={() => handleIncQuantity(selectedProduct.id)} className="circleButton"> + </button>
                </div>
              ) : (
                <button id="detailedRemoveFromCartBtn" onClick={() => handleRemoveFromCart(selectedProduct.id)}> Remove from Cart </button>
              )
            ) : (
              <button id="detailedAddToCartBtn" onClick={() => handleCart(selectedProduct.id, selectedProduct.image, selectedProduct.name, selectedProduct.price, selectedProduct.category, quantityVal)}> Add to Cart </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;