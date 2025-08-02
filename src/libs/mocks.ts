import { http, HttpResponse } from "msw";
import { productsDb } from "./productsDb";

type GetProductsParams = object;
type GetProductsResponse = Array<{
  id: number;
  brand: string;
  title: string;
  price: number;
  image: string;
}>;

export const handlers = [
  http.get<GetProductsParams, undefined, GetProductsResponse, "/api/products">(
    "/api/products",
    async () => {
      return HttpResponse.json(productsDb);
    }
  ),
];
