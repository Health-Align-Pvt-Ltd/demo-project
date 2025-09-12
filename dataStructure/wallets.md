# Wallets Data Structure

## Collection Name
`wallets`

## Description
Stores user wallet information and balance for cashless transactions.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Firebase user ID |
| balance | number | Yes | Current wallet balance |
| currency | string | Yes | Currency code (e.g., 'INR') |
| createdAt | string (ISO date) | Yes | Wallet creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "wallet_user_123",
  "userId": "user_123",
  "balance": 500.00,
  "currency": "INR",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Cashless payments for orders
- Wallet top-up transactions
- Balance tracking
- Promotional credits management