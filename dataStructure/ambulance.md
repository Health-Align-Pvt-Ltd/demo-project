# Ambulance Data Structure

## Collection Name
`ambulance`

## Description
Stores information about ambulance services.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vehicleNumber | string | Yes | Unique vehicle identifier |
| type | string | No | Type of ambulance service (e.g., 'Advanced Life Support') |
| location | object | No | Current GPS location {lat, lng} |
| isAvailable | boolean | No | Availability status |
| rating | number | No | Average driver rating (0-5) |
| equipment | array | No | List of medical equipment available |
| contactNumber | string | No | Contact phone number |
| createdAt | string (ISO date) | Yes | Creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "ambulance_123",
  "vehicleNumber": "AMB-001",
  "type": "Advanced Life Support",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "isAvailable": true,
  "rating": 4.9,
  "equipment": ["Ventilator", "Defibrillator", "Oxygen Support"],
  "contactNumber": "+91 9876543210",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Track available ambulances
- Display ambulance details in booking interface
- Support real-time location tracking