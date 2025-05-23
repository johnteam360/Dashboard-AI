import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Interfaces para tipado
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  headers: Record<string, string>;
}

// Usar variables de entorno para la configuración
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gaaeixihnhcnxgxbufum.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYWVpeGlobnhjeGdidWZ1bSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE1MDI2OTA4LCJleHAiOjIwMzA2MDI5MDh9.120TA4LC71eHA1OjIw4zA2MI5MDh9";

// Log para depuración (mostrar solo los primeros caracteres por seguridad)
console.log("Conectando a Supabase URL:", supabaseUrl);
console.log(
  "Anon Key (primeros 20 chars):",
  supabaseAnonKey.substring(0, 20) + "..."
);
console.log("Variables de entorno cargadas:", {
  hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  envUrl: import.meta.env.VITE_SUPABASE_URL,
  envKeyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length,
});

// Validar que las variables estén definidas
if (!supabaseUrl) {
  throw new Error(
    "VITE_SUPABASE_URL no está definida en las variables de entorno"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_ANON_KEY no está definida en las variables de entorno"
  );
}

let supabase: SupabaseClient;

try {
  // Creación del cliente Supabase
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Cliente Supabase creado correctamente");

  // Verificar la conexión
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(
      "Evento de autenticación:",
      event,
      session ? "Con sesión" : "Sin sesión"
    );
  });
} catch (error) {
  console.error("Error al crear cliente Supabase:", error);
  throw error;
}

export default supabase;
