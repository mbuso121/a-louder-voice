const API = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : "https://api.aloudervoice.co.za";

export default API;
