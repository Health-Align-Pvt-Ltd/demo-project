# Delivery Status Data Structure

## Collection Name
`delivery_status`

## Description
Stores real-time delivery status information for orders.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | string | Yes | Associated order ID |
| status | string | Yes | Current delivery status ('pending', 'picked', 'in_transit', 'delivered') |
| location | object | No | Current location coordinates |
| timestamp | string (ISO date) | Yes | Status update timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Location Object Structure
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lat | number | No | Latitude coordinate |
| lng | number | No | Longitude coordinate |

## Example Document
```json
{
  "id": "delivery_status_order_123",
  "orderId": "order_123",
  "status": "in_transit",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "timestamp": "2023-05-15T14:30:00Z",
  "updatedAt": "2023-05-15T14:30:00Z"
}
```

## Usage
- Real-time delivery tracking
- Location updates for customers
- Delivery coordination
- Estimated time of arrival calculations