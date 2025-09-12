# Orders Data Structure

## Collection Names
- `pharmacyOrders` - Pharmacy product orders
- `medicineOrders` - Individual medicine orders

## Description
Stores information about orders placed by users for medicines and pharmacy products.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Firebase user ID of the customer |
| items | array | Yes | List of ordered items |
| totalAmount | number | Yes | Total order amount |
| status | string | Yes | Current status ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') |
| shippingAddress | object | Yes | Delivery address information |
| paymentMethod | string | No | Payment method used |
| paymentStatus | string | No | Payment status |
| createdAt | string (ISO date) | Yes | Order creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Item Object Structure
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Product ID |
| name | string | Yes | Product name |
| quantity | number | Yes | Quantity ordered |
| price | number | Yes | Price per unit |
| imageURL | string | No | URL to product image |

## Example Document
```json
{
  "id": "order_123",
  "userId": "user_123",
  "items": [
    {
      "id": "product_456",
      "name": "Dolo 650 Tablet",
      "quantity": 2,
      "price": 32.50,
      "imageURL": "https://example.com/images/dolo650.jpg"
    },
    {
      "id": "product_789",
      "name": "Vitamin D3 60K",
      "quantity": 1,
      "price": 156.99,
      "imageURL": "https://example.com/images/vitamin_d3.jpg"
    }
  ],
  "totalAmount": 221.99,
  "status": "confirmed",
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "New Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India"
  },
  "paymentMethod": "Credit Card",
  "paymentStatus": "paid",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Order management and tracking
- Payment processing
- Inventory management
- Delivery coordination