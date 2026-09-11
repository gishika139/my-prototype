import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, scanType } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'No image provided for verification.' },
        { status: 400 }
      );
    }

    // Extract Base64 Image Data
    const base64Data = image.split(',')[1] || image;
    const mimeType = image.split(';')[0]?.split(':')[1] || 'image/jpeg';

    // Prompt for Legal Metrology & Product Health Verification
    const prompt = `
    You are an expert Legal Metrology Inspector & Nutritional Analyst AI.
    Analyze the provided product image and extract accurate details under Legal Metrology Regulations and Nutritional Guidelines.

    Return ONLY a JSON object with this EXACT structure (no markdown formatting, no text before or after):
    {
      "analysis": {
        "productType": "Specific type or category identified from image (e.g. Packaged Biscuit, Spice, Beverage, Electronics)",
        "shapeDetected": "e.g. Rectangular Box, Cylindrical Container, Irregular Packaging",
        "languages": ["Hindi", "English"],
        "ocrConfidence": "94.5%",
        "aiConfidence": "92.0%"
      },
      "extractedData": {
        "manufacturer": "Exact manufacturer name and address detected on label or 'Not Clearly Visible'",
        "productName": "Exact Brand and Product Name (in English / Hindi if present)",
        "netQuantity": "Extracted Net Weight / Volume with units (e.g. 500g, 1L) or 'Not Declared'",
        "mrp": "Extracted Price (e.g. ₹50.00 incl. taxes) or 'Not Visible'",
        "mfgDate": "Manufacturing / Expiry / Packing date if present or 'N/A'",
        "consumerCare": "Helpline or Email if present or 'Not Visible'",
        "countryOfOrigin": "Country of origin or 'India'"
      },
      "compliance": {
        "status": "COMPLIANT or NON-COMPLIANT or NEEDS REVIEW",
        "checklist": [
          {"label": "Product name clearly declared", "passed": true},
          {"label": "Net quantity in standard legal units", "passed": true},
          {"label": "Maximum Retail Price (MRP) visible", "passed": true},
          {"label": "Manufacturer name & registered address", "passed": true},
          {"label": "Consumer care details provided", "passed": true}
        ]
      },
      "healthCard": {
        "applicable": true,
        "overallHealth": "GOOD or MODERATE or POOR or NOT APPLICABLE",
        "score": 75,
        "nutrition": {
          "calories": "e.g. 250 kcal or N/A",
          "protein": "e.g. 4g or N/A",
          "totalSugar": "e.g. 8g or N/A",
          "addedSugar": "e.g. 5g or N/A",
          "totalFat": "e.g. 6g or N/A",
          "saturatedFat": "e.g. 2g or N/A",
          "sodium": "e.g. 150mg or N/A",
          "carbohydrates": "e.g. 40g or N/A",
          "fibre": "e.g. 3g or N/A"
        },
        "assessment": "Detailed 2-sentence nutritional assessment based on the image."
      }
    }
    `;

    // Call Gemini 1.5 Flash Vision Model via Google AI API
    const apiKey = process.env.GEMINI_API_KEY || 'YOUR_FREE_GEMINI_API_KEY';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }),
    });

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('AI Vision model failed to inspect the image.');
    }

    // Clean JSON String from Markdown code blocks
    const cleanedJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedJsonText);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...parsedData,
    });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Could not process image. Please try again with a clearer picture.',
      },
      { status: 500 }
    );
  }
}