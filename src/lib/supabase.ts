import { createClient } from '@supabase/supabase-js'

// Supabase 환경 변수
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Supabase 클라이언트 생성 (환경 변수가 없으면 빈 클라이언트)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// 환경 변수 체크 함수
export const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

// TypeScript 타입 정의
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  stock: number
  category?: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_key?: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

export interface Cart {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
}

export interface Profile {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: Partial<Omit<OrderItem, 'id'>>
      }
      cart: {
        Row: Cart
        Insert: Omit<Cart, 'id' | 'created_at'>
        Update: Partial<Omit<Cart, 'id' | 'created_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

