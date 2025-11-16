export const adminAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`
  }
});

export const userAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`
  }
});
