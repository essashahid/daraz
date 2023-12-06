import axios from "axios";
import api from "../../api";


export const fetchProductsKey = "fetchProducts";

export async function fetchProducts() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${api}/product/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const products = response.data.data;
  return products;
}
