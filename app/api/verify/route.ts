import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scanType } = body;

    // Simulated Processing Delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isFood = scanType === 'food' || !scanType;

    const responseData = {
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        productType: isFood ? 'Packaged Food' : 'Household Appliance',
        shapeDetected: 'Irregular Cylindrical',
        languages: ['Hindi', 'English'],
        ocrConfidence: '89.4%',
        aiConfidence: '92.1%',
      },
      extractedData: {
        manufacturer: 'Apex Foods Ltd., Plot 12, Industrial Area, HR',
        productName: isFood ? 'Whole Wheat Flour (गेहूं का आटा)' : 'Electric Appliance',
        netQuantity: isFood ? '5.0 kg' : '1 Unit',
        mrp: '₹260.00 (Incl. of all taxes)',
        mfgDate: '08/2026',
        consumerCare: '1800-111-222 / care@apexfoods.in',
        countryOfOrigin: 'India',
      },
      compliance: {
        status: 'COMPLIANT',
        checklist: [
          { label: 'Product name detected (Hindi & English)', passed: true },
          { label: 'Net quantity declared in standard units', passed: true },
          { label: 'MRP clearly visible with tax inclusion text', passed: true },
          { label: 'Complete manufacturer address and origin', passed: true },
          { label: 'Consumer care helpline number valid', passed: true },
        ],
      },
      healthCard: isFood
        ? {
            applicable: true,
            overallHealth: 'GOOD',
            score: 78,
            nutrition: {
              calories: '380 kcal',
              protein: '9 g',
              totalSugar: '12 g',
              addedSugar: '8 g',
              totalFat: '5 g',
              saturatedFat: '1.2 g',
              sodium: '240 mg',
              carbohydrates: '68 g',
              fibre: '6 g',
            },
            assessment:
              'Good source of fibre and moderate protein. Sugar content is relatively high. Suitable for occasional consumption when consumed as part of a balanced diet.',
          }
        : {
            applicable: false,
            reason: 'Health Card: Not Applicable for Non-Food Commodities.',
          },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Inspection Processing Failed' },
      { status: 500 }
    );
  }
}