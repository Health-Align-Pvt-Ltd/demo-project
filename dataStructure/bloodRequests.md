# Blood Requests Data Structure

## Collection Name
`bloodRequests`

## Description
Stores blood donation requests from users in emergency situations.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Firebase user ID of the requester |
| patientName | string | Yes | Name of the patient needing blood |
| bloodGroup | string | Yes | Required blood group |
| quantity | number | Yes | Quantity needed (in units/bottles) |
| hospitalName | string | Yes | Name of the hospital |
| hospitalAddress | string | Yes | Address of the hospital |
| contactNumber | string | Yes | Contact number for coordination |
| requiredBy | string (ISO date) | Yes | Date when blood is required |
| status | string | Yes | Current status ('active', 'fulfilled', 'cancelled') |
| createdAt | string (ISO date) | Yes | Request creation timestamp |

## Example Document
```json
{
  "id": "blood_request_123",
  "userId": "user_123",
  "patientName": "John Doe",
  "bloodGroup": "O+",
  "quantity": 2,
  "hospitalName": "Apollo Hospital",
  "hospitalAddress": "123 Medical Road, New Delhi",
  "contactNumber": "+91 9876543210",
  "requiredBy": "2023-05-20T10:00:00Z",
  "status": "active",
  "createdAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Emergency blood request management
- Blood donor matching
- Request fulfillment tracking
- Community blood donation coordination