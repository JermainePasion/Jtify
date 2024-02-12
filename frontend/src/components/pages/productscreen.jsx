// productscreen.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    console.log('ProductScreen id:', id);
    const fetchProduct = async () => {
      try {
        const response = await fetch(http://127.0.0.1:8000/products/${id});
        if (!response.ok) {
          throw new Error(Failed to fetch product. Status: ${response.status});
        }
        const data = await response.json();
        console.log('ProductScreen product:', data); // Log the product data
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error.message);
      }
    };
  
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    console.log('Add to Cart button clicked. Product:', product); // Log product before dispatch
    dispatch(addToCart(product._id, qty)); // Use product._id instead of id
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>{product.price}</p>

      <div>
        <label>Quantity:</label>
        <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
          {[...Array(product.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductScreen;