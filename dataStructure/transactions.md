# Transactions Data Structure

## Collection Name
`transactions`

## Description
Stores payment transaction records for orders and other financial activities.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Firebase user ID |
| orderId | string | No | Associated order ID |
| type | string | Yes | Transaction type ('pharmacy_order', 'medicine_order', 'wallet_topup', etc.) |
| amount | number | Yes | Transaction amount |
| currency | string | Yes | Currency code (e.g., 'INR') |
| status | string | Yes | Transaction status ('pending', 'completed', 'failed', 'refunded') |
| paymentMethod | string | No | Payment method used |
| paymentGateway | string | No | Payment gateway used |
| transactionId | string | No | External transaction ID from payment gateway |
| createdAt | string (ISO date) | Yes | Transaction creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "transaction_123",
  "userId": "user_123",
  "orderId": "order_456",
  "type": "pharmacy_order",
  "amount": 221.99,
  "currency": "INR",
  "status": "completed",
  "paymentMethod": "Credit Card",
  "paymentGateway": "Razorpay",
  "transactionId": "rzp_789xyz",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Payment processing and verification
- Financial reporting
- Refund management
- Audit trail for financial activities