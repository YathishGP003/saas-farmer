import { NextResponse } from 'next/server';

// This would typically connect to OpenAI API and your database
// For now, we'll return sample alerts
export async function GET() {
  // Mock GPT-generated alerts based on aggregated data
  const alerts = [
    {
      id: 'alert-1',
      type: 'disease',
      severity: 'high',
      message: 'Blight outbreak detected in 4 Karnataka villages. Consider preventative neem oil spray for tomato and potato crops.',
      regions: ['Karnataka'],
      crops: ['Tomato', 'Potato'],
      created: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 'alert-2',
      type: 'price',
      severity: 'medium',
      message: 'Commodity analysis suggests price surge expected for maize in June. Consider early sowing to take advantage of the market.',
      regions: ['All India'],
      crops: ['Maize'],
      created: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: 'alert-3',
      type: 'weather',
      severity: 'high',
      message: 'Unseasonal heavy rainfall predicted for Tamil Nadu next week. Delay pesticide application and ensure proper drainage systems.',
      regions: ['Tamil Nadu'],
      crops: ['All'],
      created: new Date().toISOString() // Today
    },
    {
      id: 'alert-4',
      type: 'policy',
      severity: 'low',
      message: 'New government subsidy announced for organic farmers. Check eligibility on the Agricultural Ministry website.',
      regions: ['All India'],
      crops: ['All'],
      created: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    },
    {
      id: 'alert-5',
      type: 'disease',
      severity: 'medium',
      message: 'Increased grasshopper activity observed in Punjab wheat fields. Early detection and treatment recommended.',
      regions: ['Punjab'],
      crops: ['Wheat'],
      created: new Date().toISOString() // Today
    }
  ];
  
  // Sort alerts by severity and recency
  const sortedAlerts = alerts.sort((a, b) => {
    // First sort by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    const severityDiff = severityOrder[a.severity as keyof typeof severityOrder] - 
                         severityOrder[b.severity as keyof typeof severityOrder];
    
    if (severityDiff !== 0) return severityDiff;
    
    // Then by recency (newest first)
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });
  
  return NextResponse.json(sortedAlerts);
} 