const baseUrl = `${process.env.REACT_APP_API_URL}`;
if (!baseUrl || baseUrl === "undefined") {
  throw new Error("The URL environment variable is undefined/missing");
}
export async function FetchRecipe<Response>(id?: string) {
  if (id) {
    var url = baseUrl + "/recipe/" + id;
  } else {
    var url = baseUrl + "/recipe";
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

export async function PostRecipe(
  options:
    | { method: string; headers: { "Content-Type": string }; body: string }
    | undefined
) {
  if (!options) {
    throw new Error("options is undefined");
  }
  const url = baseUrl + "/recipe";
  const response = await fetch(url, options);
  return response;
}
