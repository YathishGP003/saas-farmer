import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { regionClimateData } from '@/utils/cropData';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { pH, nitrogen, phosphorus, potassium, moisture, state, district } = await request.json();
    
    // Get climate data for the state if provided
    let climateData = { description: "Variable climate conditions", rainfall: "moderate" };
    if (state) {
      climateData = getStateClimateData(state);
    }
    
    // Use GPT to generate recommendations based on soil data
    const recommendations = await generateSoilRecommendations(
      pH,
      nitrogen,
      phosphorus,
      potassium,
      moisture,
      state,
      district,
      climateData
    );
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in soil-analysis API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get climate data for a specific state (reused from crop-suggestion)
function getStateClimateData(state: string) {
  // Normalize state name to match with our data
  const stateLower = state.toLowerCase();
  
  // Try to find direct match or partial match
  for (const region in regionClimateData) {
    if (stateLower.includes(region) || region.includes(stateLower)) {
      return regionClimateData[region];
    }
  }
  
  // Check for specific state mappings
  const stateToRegionMap: Record<string, string> = {
    "andhra pradesh": "maharashtra", // Similar climate
    "telangana": "maharashtra",
    "tamil nadu": "kerala",
    "madhya pradesh": "maharashtra",
    "rajasthan": "gujarat",
    "haryana": "punjab",
    "uttar pradesh": "punjab",
    "bihar": "west bengal",
    "jharkhand": "west bengal",
    "odisha": "west bengal",
    "chhattisgarh": "maharashtra",
    "assam": "west bengal",
    "himachal pradesh": "punjab",
    "uttarakhand": "punjab"
  };
  
  if (stateToRegionMap[stateLower]) {
    return regionClimateData[stateToRegionMap[stateLower]];
  }
  
  return regionClimateData["default"];
}

// Use OpenAI to generate soil recommendations
async function generateSoilRecommendations(
  pH: number,
  nitrogen: number,
  phosphorus: number,
  potassium: number,
  moisture: number,
  state: string,
  district: string,
  climateData: any
) {
  try {
    // Interpret soil acidity/alkalinity
    let pHDescription = "neutral";
    if (pH < 6.0) pHDescription = "acidic";
    else if (pH < 6.5) pHDescription = "slightly acidic";
    else if (pH > 7.5) pHDescription = "slightly alkaline";
    else if (pH > 8.0) pHDescription = "alkaline";
    
    // Interpret NPK levels
    const interpretNutrient = (value: number) => {
      if (value < 50) return "very low";
      if (value < 140) return "low";
      if (value < 280) return "medium";
      if (value < 560) return "high";
      return "very high";
    };
    
    const nitrogenLevel = interpretNutrient(nitrogen);
    const phosphorusLevel = interpretNutrient(phosphorus);
    const potassiumLevel = interpretNutrient(potassium);
    
    // Interpret moisture
    let moistureLevel = "medium";
    if (moisture < 20) moistureLevel = "very low";
    else if (moisture < 40) moistureLevel = "low";
    else if (moisture > 70) moistureLevel = "high";
    else if (moisture > 85) moistureLevel = "very high";
    
    // Prepare the prompt
    const prompt = `
As an agricultural soil expert, I need detailed recommendations based on the following soil analysis data:

SOIL PARAMETERS:
- pH: ${pH} (${pHDescription})
- Nitrogen (N): ${nitrogen} kg/ha (${nitrogenLevel})
- Phosphorus (P): ${phosphorus} kg/ha (${phosphorusLevel})
- Potassium (K): ${potassium} kg/ha (${potassiumLevel})
- Soil Moisture: ${moisture}% (${moistureLevel})

LOCATION INFORMATION:
${state ? `- State: ${state}` : '- State: Not specified'}
${district ? `- District: ${district}` : '- District: Not specified'}

CLIMATE INFORMATION:
${climateData ? `- Climate conditions: ${climateData.description || 'Variable'}` : ''}
${climateData ? `- Rainfall pattern: ${climateData.rainfall || 'Moderate'}` : ''}

Based on this soil analysis data, please provide a comprehensive agricultural recommendation including:

1. A list of 5-7 crops that would grow well in this soil
2. A detailed fertilizer plan including:
   - Recommended NPK ratio
   - Specific fertilizer suggestions with application rates
   - Organic fertilizer alternatives
   - How to correct any nutrient deficiencies or imbalances
3. Water management recommendations:
   - Irrigation needs based on soil moisture and crop requirements
   - Watering schedule guidelines
   - Sustainable water conservation methods
4. Sustainable farming practices suitable for this soil type

Make your recommendations specific to Indian agriculture, using locally available resources and practices. If location data is provided, tailor recommendations to that region's climate and agricultural patterns.

Format your response as JSON with the following structure:
{
  "recommendedCrops": ["Crop 1", "Crop 2", ...],
  "fertilizerPlan": {
    "npkRatio": "X-Y-Z",
    "organicOptions": ["Option 1", "Option 2", ...],
    "description": "Detailed fertilizer recommendation"
  },
  "waterRequirements": {
    "amount": "Amount description",
    "schedule": "Schedule recommendation",
    "sustainableMethods": ["Method 1", "Method 2", ...]
  },
  "sustainablePractices": ["Practice 1", "Practice 2", ...]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use appropriate model
      messages: [
        { role: "system", content: "You are an agricultural soil specialist with expertise in Indian farming practices. You provide detailed, scientifically-accurate soil management recommendations based on soil test results." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating soil recommendations:', error);
    return {
      recommendedCrops: ["Unable to generate crop recommendations"],
      fertilizerPlan: {
        npkRatio: "Unknown",
        organicOptions: ["Compost", "Farmyard manure"],
        description: "We encountered a technical issue while analyzing your data. Please try again with different parameters."
      },
      waterRequirements: {
        amount: "Unable to determine",
        schedule: "Unable to determine",
        sustainableMethods: ["Drip irrigation", "Mulching"]
      },
      sustainablePractices: ["Crop rotation", "Cover cropping", "Integrated pest management"]
    };
  }
} 