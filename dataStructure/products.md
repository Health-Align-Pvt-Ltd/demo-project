# Products Data Structure

## Collection Name
`products`

## Description
Stores information about medicines and healthcare products available in the pharmacy.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name |
| genericName | string | No | Generic name of the medicine |
| brand | string | No | Manufacturer/brand name |
| strength | string | No | Dosage strength (e.g., '500mg') |
| form | string | No | Medicine form (e.g., 'Tablet', 'Capsule') |
| pack | string | No | Packaging information (e.g., 'Strip of 15 tablets') |
| price | number | Yes | Current selling price |
| originalPrice | number | No | Original price (for discount calculation) |
| discount | number | No | Discount percentage |
| category | string | No | Product category ID |
| inStock | boolean | No | Availability status (default: true) |
| stockCount | number | No | Number of items in stock |
| requiresPrescription | boolean | No | Whether prescription is required |
| rating | number | No | Average customer rating (0-5) |
| reviewsCount | number | No | Number of customer reviews |
| fastDelivery | boolean | No | Fast delivery availability |
| isBestseller | boolean | No | Bestseller status |
| deliveryTime | string | No | Estimated delivery time |
| imageURL | string | No | URL to product image |
| keywords | array | No | Search keywords |
| description | string | No | Product description |
| manufacturer | string | No | Manufacturer information |
| tags | array | No | Product tags |
| createdAt | string (ISO date) | Yes | Creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "product_123",
  "name": "Dolo 650 Tablet",
  "genericName": "Paracetamol",
  "brand": "Micro Labs",
  "strength": "650mg",
  "form": "Tablet",
  "pack": "Strip of 15 tablets",
  "price": 32.50,
  "originalPrice": 45.00,
  "discount": 28,
  "category": "pain-relief",
  "inStock": true,
  "stockCount": 150,
  "requiresPrescription": false,
  "rating": 4.4,
  "reviewsCount": 2847,
  "fastDelivery": true,
  "isBestseller": true,
  "deliveryTime": "2-4 hours",
  "imageURL": "https://example.com/images/dolo650.jpg",
  "keywords": ["paracetamol", "fever", "headache", "pain", "dolo"],
  "description": "Effective fever and pain relief",
  "manufacturer": "Micro Labs Ltd",
  "tags": ["Fever", "Pain Relief", "Headache"],
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Displayed in pharmacy search and product listings
- Used in cart and checkout processes
- Referenced in orders and prescriptions