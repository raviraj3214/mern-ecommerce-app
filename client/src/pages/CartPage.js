import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
//import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);
  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        return total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(myCart));
     
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL, // Set a base URL for all requests from this instance
      });
      const { data } = await axiosInstance.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL, // Set a base URL for all requests from this instance
      });
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axiosInstance.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // The effect doesn't need to do anything, it just needs to be here to trigger the re-render
  }, [cart]);
  return (
    <Layout>
    
      <div className="container-fluid">
      <div className="row">
          <div className="col-12 mt-5 pt-4">
            <h4 className="text-center pt-4">
              {!auth?.user
                ? "Hello Guest"
                : `Hello ${auth?.token && auth?.user?.name}`}
            </h4>
            <h6 className="text-center pb-2">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout !"
                  }`
                : " Your Cart Is Empty"}
            </h6>
          </div>
        </div>
        <div className="row d-flex justify-content-center ">
          <div className="col-12 col-md-5 ">
            {cart?.map((p) => (
              <div className="card mb-3 mt-2 shadow"  style = {{maxWidth:"24rem"}} key={p._id}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={`${process.env.REACT_APP_URL}/api/v1/product/product-photo/${p._id}`} className="img-fluid rounded-start" alt={p.name}/>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{p.name.substring(0,15)}...</h5>
                    <p className="card-text">{p.description.substring(0, 24)}...</p>
                    <p className="card-text text-muted">Price: {p.price}$</p>
                     <button
                                className="btn btn-danger"
                                onClick={() => removeCartItem(p._id)}
                              >
                                Remove
                              </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
          <div className="col-12 col-md-3 cart-summary">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total: {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!clientToken || !auth?.token || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="btn btn-primary mb-2"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </Layout>
  );
};

export default CartPage;