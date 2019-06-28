const config = {
  api: "https://opensesameepici.herokuapp.com"
  // api: "http://staff360api.socialpressplugin.xyz:9000"
  // api: "http://localhost:9000"
};

const fetchApi = async (
  endPoint,
  payload = {},
  method = "get",
  headers = {}
) => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetchival(`${config.api}${endPoint}`, {
    headers
  })[method.toLowerCase()](payload);
};
