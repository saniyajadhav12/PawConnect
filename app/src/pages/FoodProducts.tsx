import React, { useState, useEffect } from "react";
import "../styles/FoodProducts.css";
import Header from "../components/Header";
import { Typography, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../config/api";
import { getProductImage } from "../config/productImages";
// import AddFoodProduct from "../pages/AddFoodProduct";


// Define types for Product and Props
interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

const FoodProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Stores products fetched from the API
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Stores filtered product list
  const [filter, setFilter] = useState<string>("Product Name"); // Tracks the selected filter

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/foodProduct");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    let sortedProducts: Product[];
    switch (selectedFilter) {
      case "Price: Low to High":
        sortedProducts = [...products].sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        sortedProducts = [...products].sort((a, b) => b.price - a.price);
        break;
      default:
        sortedProducts = [...products];
    }

    setFilteredProducts(sortedProducts);
  };

  return (
    <>
      <div className="food-products-page">
        <Header showCart showHamburger />
        <main>
          <section className="product-header">
            <Typography variant="h4">Food Products</Typography>
            <Select
              value={filter}
              onChange={handleFilterChange}
              className="product-filter"
              displayEmpty
            >
              <MenuItem value="Product Name">Product Name</MenuItem>
              <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
              <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
            </Select>
          </section>

          <section className="product-grid">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/productdetails/${product._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-card">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <Typography variant="h6" className="product-name">
                      {product.name}
                    </Typography>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </main>

        <footer className="footer">
          <Typography variant="body2" align="center">
            &copy; 2024 Pet Food Store
          </Typography>
        </footer>
      </div>
    </>
  );
};

export default FoodProducts;
