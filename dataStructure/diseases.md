# Diseases Data Structure

## Collection Name
`diseases`

## Description
Stores information about medical conditions, symptoms, and related medicines.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Disease name |
| category | string | No | Medical category (e.g., 'Cardiovascular', 'Endocrine') |
| description | string | No | Detailed description of the disease |
| symptoms | array | No | List of common symptoms |
| medicines | array | No | List of recommended medicines |
| createdAt | string (ISO date) | Yes | Creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "disease_123",
  "name": "Diabetes",
  "category": "Endocrine",
  "description": "A group of metabolic disorders characterized by high blood sugar",
  "symptoms": ["Frequent urination", "Increased thirst", "Weight loss"],
  "medicines": ["Metformin", "Insulin", "Glipizide"],
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Provide medical information to users
- Link diseases to relevant medicines
- Support search functionality for medical conditions