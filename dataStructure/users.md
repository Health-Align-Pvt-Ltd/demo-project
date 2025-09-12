# Users Data Structure

## Collection Name
`users`

## Description
Stores user profile information, including patients, doctors, and administrators.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| uid | string | Yes | Firebase Authentication user ID |
| email | string | No | User's email address |
| phoneNumber | string | No | User's phone number |
| name | string | No | User's full name |
| photoURL | string | No | URL to user's profile picture |
| userType | string | Yes | Type of user ('patient', 'doctor', 'admin') |
| dateOfBirth | string | No | User's date of birth (YYYY-MM-DD) |
| gender | string | No | User's gender |
| address | object | No | User's address information |
| profileCompleted | boolean | No | Whether user has completed profile setup |
| isVerified | boolean | No | Whether user's account is verified |
| authProvider | string | No | Authentication provider ('google', 'phone', etc.) |
| createdAt | string (ISO date) | Yes | Account creation timestamp |
| updatedAt | string (ISO date) | No | Last profile update timestamp |
| lastLoginAt | string (ISO date) | No | Last login timestamp |

## Example Document
```json
{
  "uid": "user_123",
  "email": "user@example.com",
  "phoneNumber": "+91 9876543210",
  "name": "John Doe",
  "photoURL": "https://example.com/images/profile.jpg",
  "userType": "patient",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "address": {
    "street": "123 Main Street",
    "city": "New Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India"
  },
  "profileCompleted": true,
  "isVerified": true,
  "authProvider": "google",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z",
  "lastLoginAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- User authentication and profile management
- Personalized content and recommendations
- Order and appointment history tracking
- Communication with healthcare providers