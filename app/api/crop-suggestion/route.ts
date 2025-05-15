import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cropData, getCurrentSeason, getHarvestSeason, regionClimateData } from '@/utils/cropData';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { timeRange, state, plantingSeason, soilType } = await request.json();
    
    // Get climate data for the state
    const climateData = getStateClimateData(state);
    
    // Determine current and harvest seasons
    const currentSeason = getCurrentSeason();
    const harvestSeason = getHarvestSeason(timeRange);
    
    // Use GPT to generate crop suggestions
    const suggestions = await generateCropSuggestions(
      timeRange,
      state,
      plantingSeason,
      soilType,
      currentSeason,
      harvestSeason,
      climateData
    );
    
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error in crop-suggestion API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get climate data for a specific state
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

// Use OpenAI to generate crop suggestions
async function generateCropSuggestions(
  timeRange: number,
  state: string,
  plantingSeason: string,
  soilType: string,
  currentSeason: string,
  harvestSeason: string,
  climateData: any
) {
  try {
    const currentDate = new Date();
    const harvestDate = new Date();
    harvestDate.setMonth(harvestDate.getMonth() + timeRange);
    
    // Extract the actual season name from the selection (remove the description)
    const selectedSeason = plantingSeason.split(" ")[0];
    
    // Prepare the prompt
    const prompt = `
As an agricultural expert, I need detailed crop recommendations based on the following information:

PARAMETERS:
- State: ${state}
- Soil Type: ${soilType}
- Planting Season: ${plantingSeason}
- Time to Harvest: ${timeRange} months
- Current Date: ${currentDate.toLocaleDateString()}
- Projected Harvest Date: ${harvestDate.toLocaleDateString()}

CLIMATE INFORMATION:
- Climate conditions: ${climateData.description || `Climate in ${state} varies throughout the year`}
- Rainfall pattern: ${climateData.rainfall || "Variable"}

Please recommend 4-5 crops that would be suitable for this specific combination of state, soil type, planting season, and harvest timeline. For each recommended crop, provide:

1. The name of the crop
2. A detailed explanation including:
   - Why this crop is ideal for ${state}'s climate
   - How this crop performs in ${soilType} soil
   - Why the crop is suitable for planting in ${selectedSeason} season
   - Whether the ${timeRange}-month growing period aligns with the crop's optimal harvest time
   - Any special considerations for this crop in terms of irrigation, fertilization, or pest management
   - Expected market potential at the projected harvest time

Format your response as JSON with the following structure:
{
  "message": "A brief overview of the agricultural situation and general advice",
  "suggestedCrops": [
    {
      "name": "Crop Name 1",
      "rationale": "Detailed explanation for this crop recommendation"
    },
    {
      "name": "Crop Name 2",
      "rationale": "Detailed explanation for this crop recommendation"
    },
    ... more crops
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use appropriate model
      messages: [
        { role: "system", content: "You are an agricultural expert system specializing in Indian agriculture. You provide detailed, scientifically-accurate crop recommendations based on local conditions." },
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
    console.error('Error generating crop suggestions:', error);
    return {
      message: "There was an error processing your request. Please try again later.",
      suggestedCrops: [
        {
          name: "Unable to generate recommendations",
          rationale: "We encountered a technical issue while analyzing your data. Please try again with different parameters or contact support if the problem persists."
        }
      ]
    };
  }
} 