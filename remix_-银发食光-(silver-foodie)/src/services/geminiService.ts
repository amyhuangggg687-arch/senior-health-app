import { GoogleGenAI, Type } from "@google/genai";
import { HealthProfile, VideoContent } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function analyzeRecipe(video: VideoContent, profile: HealthProfile) {
  const prompt = `
    作为一名老年营养专家，请分析以下菜谱并根据老人的健康档案提供改良建议。
    
    原始菜品: ${video.title}
    食材: ${video.ingredients.join(", ")}
    描述: ${video.description}
    
    老人健康档案:
    - 疾病状况: ${profile.conditions.join(", ")}
    - 饮食禁忌: ${profile.restrictions.join(", ")}
    - 牙口状况: ${profile.dentalStatus === 'poor' ? '不好，需要软烂' : profile.dentalStatus === 'fair' ? '一般' : '良好'}
    - 个人喜好: ${profile.preferences.join(", ")}
    
    请输出一份JSON格式的改良方案，包含以下字段：
    1. modifiedTitle: 改良后的菜名
    2. healthReason: 为什么要这样改良（针对健康状况）
    3. ingredients: 改良后的食材清单
    4. steps: 详细的烹饪步骤（强调适合老人的处理方式）
    5. nutritionTips: 营养小贴士
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modifiedTitle: { type: Type.STRING },
            healthReason: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            nutritionTips: { type: Type.STRING },
          },
          required: ["modifiedTitle", "healthReason", "ingredients", "steps", "nutritionTips"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}
