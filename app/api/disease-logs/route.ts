import { NextResponse } from 'next/server';

// This would typically connect to your database
// For now, we'll create some sample data
const sampleDiseaseLogs = [
  {
    id: '1',
    cropName: 'Rice',
    diseaseName: 'Blast',
    diagnosisDate: '2024-05-10T08:30:00.000Z',
    severity: 'High',
    region: 'Karnataka',
    userId: 'user1'
  },
  {
    id: '2',
    cropName: 'Wheat',
    diseaseName: 'Rust',
    diagnosisDate: '2024-05-12T14:20:00.000Z',
    severity: 'Medium',
    region: 'Tamil Nadu',
    userId: 'user2'
  },
  {
    id: '3',
    cropName: 'Cotton',
    diseaseName: 'Boll Rot',
    diagnosisDate: '2024-05-09T11:45:00.000Z',
    severity: 'Low',
    region: 'Karnataka',
    userId: 'user1'
  },
  {
    id: '4',
    cropName: 'Tomato',
    diseaseName: 'Early Blight',
    diagnosisDate: '2024-05-13T09:15:00.000Z',
    severity: 'High',
    region: 'Tamil Nadu',
    userId: 'user3'
  },
  {
    id: '5',
    cropName: 'Maize',
    diseaseName: 'Leaf Spot',
    diagnosisDate: '2024-05-11T16:30:00.000Z',
    severity: 'Medium',
    region: 'Karnataka',
    userId: 'user2'
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get('crop');
  const region = searchParams.get('region');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  let filteredLogs = [...sampleDiseaseLogs];
  
  // Apply filters
  if (crop) {
    filteredLogs = filteredLogs.filter(log => 
      log.cropName.toLowerCase() === crop.toLowerCase()
    );
  }
  
  if (region) {
    filteredLogs = filteredLogs.filter(log => 
      log.region.toLowerCase() === region.toLowerCase()
    );
  }
  
  if (startDate) {
    const start = new Date(startDate).getTime();
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.diagnosisDate).getTime() >= start
    );
  }
  
  if (endDate) {
    const end = new Date(endDate).getTime();
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.diagnosisDate).getTime() <= end
    );
  }
  
  return NextResponse.json(filteredLogs);
} 