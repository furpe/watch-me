import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://sua-url-aqui.supabase.co' &&
  !supabaseUrl.includes('sua-url')
);

/**
 * Cliente Supabase tipado.
 * Se as variáveis de ambiente não estiverem preenchidas, é inicializado com valores dummy
 * para que o bundle continue funcionando e o serviço faça fallback limpo para os dados de teste.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
