import React, { useState, useEffect } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
//import { AiFillWarning } from "react-icons/ai";

import toast from "react-hot-toast";
import "../styles/CartStyles.css";


import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  return (
    <Layout title={"Search results"}>
      <div className="container-fluid row search-page">
        <div className="text-center mt-5">
          <div className="text-center mt-5">
          <h4 className="">Search Resuts</h4>
          <h6 className="pb-4 pt-1">
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          </div>
          <div className="d-flex flex-wrap">
            {values?.results.map((p) => (
              <div className="card m-2 shadow" style={{ width: "18rem" }} key={p._id}>
              <img
                src={`${process.env.REACT_APP_URL}/api/v1/product/product-photo/${p._id}`}
                className="card-img-top" 
                alt={p.name}
                onClick={() => navigate(`/product/${p.slug}`)}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text title">
                  {p.description}
                </p>
                <div className="card-name-price ">
                <button class="btn btn-info m-1 card-button" onClick={() => navigate(`/product/${p.slug}`)}>MORE DETAILS</button>

                <button class="btn btn-dark m-1 card-button"  onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}>ADD TO CART</button>

                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
