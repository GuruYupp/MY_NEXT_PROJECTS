export async function fetchdata(
  url: string,
  headers?: { [key: string]: string },
) {
  console.log(url, "----");
  const response = await fetch(url, {
    headers: headers || {},
  });
  console.log(response);
  const jsonData = await response.json();
  return jsonData;
}
