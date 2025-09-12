# Ambulance Drivers Data Structure

## Collection Name
`ambulance_drivers`

## Description
Stores information about ambulance drivers.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Driver's full name |
| licenseNumber | string | No | Driving license number |
| phone | string | No | Contact phone number |
| experience | string | No | Years of experience |
| rating | number | No | Average rating (0-5) |
| currentLocation | object | No | Current GPS location {lat, lng} |
| ambulanceId | string | No | ID of assigned ambulance |
| isOnDuty | boolean | No | Duty status |
| createdAt | string (ISO date) | Yes | Creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "driver_123",
  "name": "Rajesh Kumar",
  "licenseNumber": "DL123456789",
  "phone": "+91 9876543210",
  "experience": "5 years",
  "rating": 4.8,
  "currentLocation": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "ambulanceId": "AMB-001",
  "isOnDuty": true,
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Manage driver information
- Assign drivers to ambulances
- Track driver availability and location