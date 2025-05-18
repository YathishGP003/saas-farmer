import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { mkdir } from 'fs/promises';
import { generateJSON } from '@/utils/ollama';
const ollama_model  = process.env.OLLAMA_MODEL;
const OLLAMA_BASE_URL = process.env.OLLAMA_HOST

const execAsync = promisify(exec);
export async function generateText(
  model: string = 'llama3',
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  try {
    const requestBody: any = {
      model: model,
      prompt: prompt,
      stream: false,
    };

    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
}


export async function POST(req: NextRequest) {
  try {
    const tempDir = path.join(process.cwd(), 'tmp');
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }

    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imagePath = path.join(tempDir, `upload-${Date.now()}.jpg`);
    await fs.promises.writeFile(imagePath, buffer);

    const imageBase64 = buffer.toString('base64');
    
    const pythonScript = path.join(process.cwd(), 'scripts', 'predict.py');
    
    const { stdout, stderr } = await execAsync(`python3.12 ${pythonScript} "${imageBase64}"`);
    
    try {
      await fs.promises.unlink(imagePath);
    } catch (error) {
      console.error('Error deleting temporary file:', error);
    }
    
    if (stderr) {
      console.error('Error from Python script:', stderr);
      return NextResponse.json(
        { error: 'Error running prediction script', details: stderr },
        { status: 500 }
      );
    }
    
    const result = JSON.parse(stdout.trim());
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Get treatment information from Ollama
    const prompt = `Please provide detailed information about ${result.disease} in plants, including its symptoms, treatment methods, and prevention measures.`;
    const systemPrompt = 'You are an agricultural expert specializing in plant diseases. Provide comprehensive and practical information.';
    
    const treatmentInfo = await generateText(ollama_model, prompt, systemPrompt);
    
    return NextResponse.json({
      disease: result.disease,
      confidence: result.confidence,
      date: result.date,
      treatmentInfo: treatmentInfo
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process the image', details: String(error) },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};