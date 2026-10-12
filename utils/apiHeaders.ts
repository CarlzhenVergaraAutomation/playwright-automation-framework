// utils/apiHeaders.ts
export function getApiHeaders() {
  //function to get API headers
  const token = process.env.API_TOKEN; //get the API token from environment variables

  if (!token) {
    //if the token is not set, throw an error
    throw new Error('API_TOKEN is not configured');
  }

  return {
    //return the headers object
    Authorization: `Bearer ${token}`,
  };
}
