// eslint-disable-next-line @typescript-eslint/no-require-imports
import {
  AuthResponse,
  Cart,
  CartItem,
  Confectionery,
  Order,
} from "./definitions";

const API_URL = "http://localhost:5000";

export type Pagination<T> = {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  isServer: boolean = false,
): Promise<ApiResponse<T>> {
  try {
    if (isServer) {
      const { cookies } = await import("next/headers");
      const cookiesStorage = cookies().getAll();
      const cookie = cookiesStorage
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join(";");

      options.headers = {
        ...options.headers,
        Cookie: cookie,
      };
    } else {
      options.credentials = "include";
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      return {
        success: false,
        error: `Fetch reqeust failed with status: ${response.status}`,
      };
    }

    const data: T = await response.json();

    return { success: true, data: data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function getConfectioneries(
  page: string | undefined,
  category: string | undefined,
  search: string | undefined,
): Promise<ApiResponse<Pagination<Confectionery>>> {
  page = page || "1";

  let query = `${API_URL}/api/confectioneries?page=${page}`;

  if (category) {
    query += `&category=${category}`;
  }
  if (search) {
    query += `&search=${search}`;
  }

  const response = await apiFetch<Pagination<Confectionery>>(query, {}, true);
  return response;
}

export async function getUserSession(): Promise<ApiResponse<AuthResponse>> {
  const response = await apiFetch<AuthResponse>(
    `${API_URL}/api/auth/session`,
    {
      cache: "no-store",
    },
    true,
  );

  return response;
}

export async function getCart(): Promise<ApiResponse<Cart>> {
  const response = await apiFetch<Cart>(
    `${API_URL}/api/cart`,
    {
      cache: "no-store",
    },
    true,
  );

  return response;
}

export async function addToCart(
  confectioneryId: number,
): Promise<ApiResponse<CartItem>> {
  const response = await apiFetch<CartItem>(
    `${API_URL}/api/cart/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        confectionery_id: confectioneryId,
        confectionery_quantity: 1,
      }),
    },
    false,
  );

  return response;
}

export async function updateCartItemQuantity(
  confectioneryId: number,
  updatedConfectioneryQuantity: number,
): Promise<ApiResponse<CartItem>> {
  const response = await apiFetch<CartItem>(
    `${API_URL}/api/cart/items/${confectioneryId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        confectionery_quantity: updatedConfectioneryQuantity,
      }),
    },
    false,
  );

  return response;
}

export async function createOrder(): Promise<ApiResponse<Order>> {
  const response = await apiFetch<Order>(
    `${API_URL}/api/orders`,
    {
      method: "POST",
      cache: "no-store",
    },
    false,
  );

  return response;
}
