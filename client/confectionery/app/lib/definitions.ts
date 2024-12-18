export type User = {
  id: number;
  email: string;
};

export type AuthUser = {
  isAuthenticated: boolean;
  user?: User;
};

export type AuthResponse = {
  success: boolean;
  user?: User;
};

export type Confectionery = {
  confectionery_id: number;
  confectionery_name: string;
  confectionery_price: number;
  confectionery_image_url: string;
  confectionery_category_id: number;
  confectionery_category_name: string;
  confectionery_category_description: string;
};

export type ConfectioneryCategory = {
  id: number;
  name: string;
  description: string;
};

export type CartItem = {
  confectionery_id: number;
  confectionery_name: string;
  confectionery_quantity: number;
  confectionery_price: number;
};

export type Cart = {
  user_id: number;
  total_items_count: number;
  total_price: number;
  cart_items: CartItem[];
};

export type Order = {
  id: number;
  user_id: number;
  order_status: string;
  created_at: string;
  updated_at: string;
  total_items_count: number;
  total_price: number;
  order_items: OrderItem[];
};

export type OrderItem = {
  confectionery_id: number;
  confectionery_quantity: number;
  confectionery_price: number;
  item_total_price: number;
};
