const config = {
  //api: "http://staff360api.socialpressplugin.xyz:8000",
  api: "http://localhost:8000"
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
