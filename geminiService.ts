
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTechnicalAnalysis = async (data: any) => {
  const prompt = `
    Como experto senior en ingeniería de minas especializado en perforación y voladura subterránea, analiza los siguientes parámetros:
    - Ancho de frente: ${data.width}m
    - Alto de frente: ${data.height}m
    - Avance: ${data.advance}m
    - Tipo de roca: ${data.rockType}
    
    Resultados calculados:
    - Espaciamiento: ${data.results.spacing}m
    - Burden: ${data.results.burden}m
    - Nro Taladros: ${data.results.holesCount}
    - Carga Explosiva: ${data.results.totalExplosive}kg
    - Costo Total: S/ ${data.results.costs.total}

    Proporciona un análisis profesional detallado en tres secciones:
    1. Optimización Técnica (malla, reducción de sobreperforación, etc.)
    2. Impacto Ambiental (gases, vibraciones)
    3. Seguridad (distancia, ventilación)
    
    Usa un lenguaje técnico riguroso.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return "Error al generar el análisis técnico. Por favor, intente de nuevo.";
  }
};

export const chatWithAssistant = async (message: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Eres SubMine AI, un asistente experto en minería subterránea. Proporcionas respuestas técnicas, precisas y seguras sobre perforación, voladura, geomecánica y normativas mineras.',
      },
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "Lo siento, hubo un problema con mi sistema de procesamiento minero.";
  }
};
