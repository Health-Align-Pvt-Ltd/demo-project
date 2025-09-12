# Cart Data Structure

## Collection Name
`cart`

## Description
Stores shopping cart information for users. Each document represents a user's cart for a specific cart type.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Firebase user ID |
| cartType | string | Yes | Type of cart ('medicine', 'pharmacy', 'pharmacy_wishlist') |
| items | array | Yes | List of items in the cart |
| createdAt | string (ISO date) | Yes | Cart creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Item Object Structure
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Product ID |
| name | string | Yes | Product name |
| quantity | number | Yes | Quantity in cart |
| price | number | Yes | Price per unit |
| imageURL | string | No | URL to product image |
| genericName | string | No | Generic name of medicine |
| brand | string | No | Brand name |
| strength | string | No | Medicine strength |
| form | string | No | Medicine form (tablet, capsule, etc.) |

## Document ID Format
Documents in this collection use a composite key format: `{userId}_{cartType}`

## Example Document
```json
{
  "userId": "user_123",
  "cartType": "medicine",
  "items": [
    {
      "id": "product_456",
      "name": "Dolo 650 Tablet",
      "quantity": 2,
      "price": 32.50,
      "imageURL": "https://example.com/images/dolo650.jpg",
      "genericName": "Paracetamol",
      "brand": "Micro Labs",
      "strength": "650mg",
      "form": "Tablet"
    }
  ],
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Temporary storage of items before checkout
- Wishlist functionality
- Persistent cart across sessions