# Pharmacy Data Structure

## Collection Name
`pharmacy`

## Description
Stores information about partner pharmacies.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Pharmacy name |
| address | string | No | Physical address |
| phone | string | No | Contact phone number |
| rating | number | No | Average customer rating (0-5) |
| isOpen | boolean | No | Current operational status |
| workingHours | string | No | Operating hours |
| services | array | No | List of services offered |
| createdAt | string (ISO date) | Yes | Creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "pharmacy_123",
  "name": "HealthAlign Main Pharmacy",
  "address": "123 Main Street, Health District",
  "phone": "+91 1800-123-4567",
  "rating": 4.8,
  "isOpen": true,
  "workingHours": "24/7",
  "services": ["Prescription", "OTC Medicines", "Health Consultation"],
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Display partner pharmacies in the UI
- Show pharmacy details and services
- Support pharmacy selection for orders