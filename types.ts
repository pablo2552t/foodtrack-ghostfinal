
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  PREPARING = 'En preparación',
  READY = 'Listo para retirar',
  DELIVERED = 'Entregado'
}

export type Role = 'admin' | 'client' | 'guest' | 'cook';

export interface Order {
  id: string;
  customerName?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export interface User {
  name: string;
  role: Role;
  username?: string; // Optional for tracking which account is logged in
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  password?: string; // Optional because clients might not have passwords in this simplified flow
  role: Role;
}

export type Tab = 'menu' | 'status' | 'checkout' | 'history' | 'admin' | 'kitchen';
