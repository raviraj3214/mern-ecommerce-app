import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all category
  const getAllCategory = async () => {
    try {
      const instance = axios.create({
        baseURL: process.env.REACT_APP_URL, // Set a base URL for all requests from this instance
      });
      const { data } = await instance.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      const instance = axios.create({
        baseURL: process.env.REACT_APP_URL // Set a base URL for all requests from this instance
      });
      setLoading(true);
      const { data } = await instance.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const instance = axios.create({
        baseURL: process.env.REACT_APP_URL, // Set a base URL for all requests from this instance
      });
      const { data } = await instance.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const instance = axios.create({
        baseURL: process.env.REACT_APP_URL, // Set a base URL for all requests from this instance
      });
      const { data } = await instance.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const instance = axios.create({
        baseURL: process.env.REACT_APP_URL, // Set a base URL for all requests from this instance
      });
      const { data } = await instance.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"ALl Products - Best offers "}>
      {/* banner image */}
      < div className="pt-3 pt-md-0 pt-md-0 pt-md-0">
      <img
        src="/images/banner2.png"
        className="banner-img mb-1 pt-4 pt-md-0 "
        alt="bannerimage"
        width={"100%"}
      />
      
      {/* banner image */}
      </div>
      <div className="container-fluid row home-page">
      <div className="col-6 col-sm-2 filters p-1 ">
          <h5 className="mt-2 ml-2">Filter By Price</h5>
          <div className="d-flex flex-column align-i ">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-10 col-sm-10 mx-auto">
          <h1 className="text-center">All Products</h1>
          
          <div className="d-flex flex-wrap mob">
  {products?.map((p) => (
    <div className="card m-md-2 mx-auto my-2 card-mob shadow" style={{ width: "18rem" }} key={p._id}>
      <img
        src={`${process.env.REACT_APP_URL}/api/v1/product/product-photo/${p._id}`}
        className="card-img-top"
        alt={p.name}
        onClick={() => navigate(`/product/${p.slug}`)}
      />
      <div className="card-body">
        <h5 className="card-title title">{p.name}</h5>
        <div className="card-price">
          <h5 className="card-price-text">
            {p.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h5>
        </div>
        <div>
        <p className="card-text title">
          {p.description}
        </p>
        </div>
        <div className="card-name-price title">
          <button
            className="btn btn-info m-1 "
            onClick={() => navigate(`/product/${p.slug}`)}
          >
            MORE DETAILS
          </button>
          <button
            className="btn btn-dark m-1 "
            onClick={() => {
              setCart([...cart, p]);
              localStorage.setItem(
                "cart",
                JSON.stringify([...cart, p])
              );
              toast.success("Item Added to cart");
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
