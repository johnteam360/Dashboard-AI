import supabase from "./supabase";
import { UserProfile } from "./userService";
import { Project } from "./projectService";
import {
  demoUsers,
  demoProjects,
  demoAIStats,
  simulateNetworkDelay,
} from "./demoData";

// Interfaces para tipado
export interface AICompletionRequest {
  prompt: string;
  projectId?: string;
}

export interface AISearchRequest {
  query: string;
}

// Modo demo: cambiar a false cuando Supabase esté funcionando
const DEMO_MODE = true;

// Clase de servicio para funcionalidades de IA
class AIService {
  // Generar texto con IA basado en un prompt
  async generateCompletion(request: AICompletionRequest): Promise<string> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(800);

      // Simulación de respuestas de IA basadas en el prompt
      const responses = [
        "Este proyecto tiene como objetivo crear una solución innovadora que mejore la experiencia del usuario mediante tecnologías modernas y un diseño intuitivo. Se implementarán las mejores prácticas de desarrollo para garantizar escalabilidad, rendimiento y mantenibilidad del código.",
        "Desarrollo completo utilizando frameworks modernos como React, Node.js y bases de datos robustas. El proyecto incluye funcionalidades avanzadas de seguridad, autenticación de usuarios y una interfaz responsiva que se adapta a cualquier dispositivo.",
        "Solución integral que abarca desde la planificación hasta la implementación, incluyendo análisis de requisitos, diseño de arquitectura, desarrollo de funcionalidades y pruebas exhaustivas para asegurar la calidad del producto final.",
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    }

    try {
      const { data, error } = await supabase.rpc("get_ai_completion", {
        project_id_param: request.projectId || "",
        prompt_param: request.prompt,
      });

      if (error) {
        console.error("Error calling AI completion:", error);
        throw error;
      }

      return data || "No se pudo generar una respuesta.";
    } catch (error) {
      console.error("AI completion failed:", error);
      throw error;
    }
  }

  // Buscar usuarios utilizando IA
  async searchUsers(request: AISearchRequest): Promise<UserProfile[]> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(600);

      // Simulación de búsqueda inteligente
      const query = request.query.toLowerCase();
      let results = [...demoUsers];

      if (query.includes("admin")) {
        results = results.filter((user) => user.is_admin);
      }
      if (query.includes("activo")) {
        results = results.filter((user) => user.is_active);
      }
      if (query.includes("inactivo")) {
        results = results.filter((user) => !user.is_active);
      }

      return results;
    }

    try {
      const { data, error } = await supabase.rpc("search_users_with_ai", {
        search_query: request.query,
      });

      if (error) {
        console.error("Error searching users with AI:", error);
        throw error;
      }

      return (data as UserProfile[]) || [];
    } catch (error) {
      console.error("AI user search failed:", error);
      throw error;
    }
  }

  // Búsqueda avanzada de proyectos con IA
  async searchProjects(request: AISearchRequest): Promise<Project[]> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(600);

      // Simulación de búsqueda inteligente
      const query = request.query.toLowerCase();
      let results = [...demoProjects];

      if (query.includes("web")) {
        results = results.filter((project) => project.type === "web");
      }
      if (query.includes("móvil") || query.includes("mobile")) {
        results = results.filter((project) => project.type === "mobile");
      }
      if (query.includes("activo")) {
        results = results.filter((project) => project.status === "active");
      }
      if (query.includes("pendiente")) {
        results = results.filter((project) => project.status === "pending");
      }
      if (query.includes("completado")) {
        results = results.filter((project) => project.status === "completed");
      }

      return results;
    }

    try {
      // Endpoint que necesita ser implementado en Supabase
      const { data, error } = await supabase.rpc("search_projects_with_ai", {
        search_query: request.query,
      });

      if (error) {
        console.error("Error searching projects with AI:", error);
        throw error;
      }

      return (data as Project[]) || [];
    } catch (error) {
      console.error("AI project search failed:", error);
      throw error;
    }
  }

  // Obtener estadísticas de uso de AI
  async getUsageStats(): Promise<{
    totalCompletions: number;
    totalSearches: number;
  }> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(400);
      return demoAIStats;
    }

    try {
      // Endpoint que necesita ser implementado en Supabase
      const { data, error } = await supabase.rpc("get_ai_usage_stats");

      if (error) {
        console.error("Error getting AI usage stats:", error);
        throw error;
      }

      return data || { totalCompletions: 0, totalSearches: 0 };
    } catch (error) {
      console.error("Failed to get AI usage stats:", error);
      throw error;
    }
  }
}

export default new AIService();
