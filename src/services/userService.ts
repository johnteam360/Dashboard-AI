import supabase from "./supabase";
import { demoUsers, generateId, simulateNetworkDelay } from "./demoData";

// Interfaces para tipado
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UserProfileInput {
  email: string;
  full_name?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

// Modo demo: cambiar a false cuando Supabase esté funcionando
const DEMO_MODE = true;

// Clase de servicio para usuarios
class UserService {
  // Obtener todos los usuarios
  async getAll(): Promise<UserProfile[]> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(300);
      return [...demoUsers];
    }

    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    return data as UserProfile[];
  }

  // Obtener un usuario por ID
  async getById(id: string): Promise<UserProfile | null> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(200);
      return demoUsers.find((user) => user.id === id) || null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }

    return data as UserProfile;
  }

  // Crear un nuevo usuario
  async create(user: UserProfileInput): Promise<UserProfile> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(400);
      const newUser: UserProfile = {
        id: generateId(),
        email: user.email,
        full_name: user.full_name || "",
        is_admin: user.is_admin || false,
        is_active: user.is_active !== undefined ? user.is_active : true,
        created_at: new Date().toISOString(),
      };
      demoUsers.push(newUser);
      return newUser;
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        ...user,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    return data as UserProfile;
  }

  // Actualizar un usuario existente
  async update(
    id: string,
    updates: Partial<UserProfileInput>
  ): Promise<UserProfile> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(300);
      const userIndex = demoUsers.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error("Usuario no encontrado");
      }
      demoUsers[userIndex] = { ...demoUsers[userIndex], ...updates };
      return demoUsers[userIndex];
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }

    return data as UserProfile;
  }

  // Eliminar un usuario
  async delete(id: string): Promise<void> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(250);
      const userIndex = demoUsers.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error("Usuario no encontrado");
      }
      demoUsers.splice(userIndex, 1);
      return;
    }

    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  // Activar/desactivar un usuario
  async toggleActive(id: string, isActive: boolean): Promise<UserProfile> {
    return this.update(id, { is_active: isActive });
  }

  // Promover/degradar un usuario a/de administrador
  async toggleAdmin(id: string, isAdmin: boolean): Promise<UserProfile> {
    return this.update(id, { is_admin: isAdmin });
  }

  // Buscar usuarios utilizando IA
  async searchWithAI(query: string): Promise<UserProfile[]> {
    // Llamada a la función de Edge para buscar usuarios
    const { data, error } = await supabase.rpc("search_users_with_ai", {
      search_query: query,
    });

    if (error) {
      console.error("Error searching users with AI:", error);
      throw error;
    }

    return (data as UserProfile[]) || [];
  }

  // Buscar usuarios por correo electrónico
  async searchByEmail(email: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", `%${email}%`);

    if (error) {
      console.error(`Error searching users by email ${email}:`, error);
      throw error;
    }

    return data as UserProfile[];
  }

  // Buscar usuarios por nombre completo
  async searchByName(name: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("full_name", `%${name}%`);

    if (error) {
      console.error(`Error searching users by name ${name}:`, error);
      throw error;
    }

    return data as UserProfile[];
  }
}

export default new UserService();
