import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import * as formidable from 'formidable';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { mkdir } from 'fs/promises';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your environment variables
});

export async function POST(req: NextRequest) {
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory already exists or cannot be created
      console.error('Error creating temp directory:', error);
    }

    // Parse form data with image
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save image temporarily
    const imagePath = path.join(tempDir, `upload-${Date.now()}.jpg`);
    await fs.promises.writeFile(imagePath, buffer);

    // Convert image to base64
    const imageBase64 = buffer.toString('base64');
    const dataUrl = `data:${imageFile.type};base64,${imageBase64}`;

    // Call GPT-4 Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'This is an image of a plant that may have a disease. Please analyze it and provide the following details in JSON format: 1) Disease name, 2) Cure recommendations, 3) Prevention tips. Please format your response as a valid JSON object with fields "name", "cure", and "prevention".',
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
                detail: 'high'
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    // Clean up temporary file
    try {
      await fs.promises.unlink(imagePath);
    } catch (error) {
      console.error('Error deleting temporary file:', error);
    }

    // Parse result
    const result = response.choices[0].message.content;
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to analyze the image' },
        { status: 500 }
      );
    }

    // Parse the JSON string from the OpenAI response
    const analysisResult = JSON.parse(result);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process the image' },
      { status: 500 }
    );
  }
}

// Increase payload size limit for image uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
}; 