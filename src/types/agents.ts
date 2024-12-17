export interface Agent {
  name: string;
  role: string;
  href: string;
  description: string;
  category: 'sales' | 'operations' | 'data' | 'service';
}