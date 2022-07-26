const baseUrl = `${process.env.REACT_APP_API_URL}`;
if (!baseUrl || baseUrl === "undefined") {
  throw new Error("The URL environment variable is undefined/missing");
}
export async function FetchRecipe<Response>(id?: string) {
  let url = baseUrl + "/recipe";
  if (id) {
    url = url + "/" + id;
  }

  const response = await fetch(url);
  const data: Response = await response.json();
  if (!data) {
    throw new Error(
      "The fetch call did not return any data matching the Recipe Type"
    );
  }

  return data;
}

export async function PostRecipe(options: {
  method: string;
  headers: { "Content-Type": string };
  body: string;
}) {
  const url = baseUrl + "/recipe";
  const response = await fetch(url, options);
  return response;
}
