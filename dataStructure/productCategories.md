# Product Categories Data Structure

## Collection Name
`productCategories`

## Description
Stores information about product categories used to organize medicines and healthcare products.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Category name |
| description | string | No | Detailed description of the category |
| icon | string | No | Emoji or icon representation |
| createdAt | string (ISO date) | Yes | Creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "pain-relief",
  "name": "Pain Relief",
  "description": "Medicines for pain management and relief",
  "icon": "💊",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Organize products in the pharmacy interface
- Filter and search products by category
- Display category navigation in the UI