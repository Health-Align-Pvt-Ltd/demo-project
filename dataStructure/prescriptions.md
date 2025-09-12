# Prescriptions Data Structure

## Collection Name
`prescriptions`

## Description
Stores digital prescriptions issued by doctors to patients.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Firebase user ID of the patient |
| doctorId | string | Yes | Firebase user ID of the prescribing doctor |
| medicines | array | Yes | List of prescribed medicines |
| diagnosis | string | No | Diagnosis information |
| notes | string | No | Additional notes from the doctor |
| status | string | Yes | Current status ('pending_verification', 'verified', 'rejected') |
| createdAt | string (ISO date) | Yes | Prescription creation timestamp |

## Medicine Object Structure
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Medicine name |
| dosage | string | Yes | Dosage instructions |
| duration | string | No | Treatment duration |
| frequency | string | No | How often to take the medicine |

## Example Document
```json
{
  "id": "prescription_123",
  "userId": "user_patient_123",
  "doctorId": "user_doctor_456",
  "medicines": [
    {
      "name": "Paracetamol 650mg",
      "dosage": "1 tablet twice daily after meals",
      "duration": "5 days",
      "frequency": "Twice daily"
    },
    {
      "name": "Amoxicillin 500mg",
      "dosage": "1 capsule three times daily",
      "duration": "7 days",
      "frequency": "Three times daily"
    }
  ],
  "diagnosis": "Upper respiratory tract infection",
  "notes": "Patient should drink plenty of fluids",
  "status": "verified",
  "createdAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Digital prescription management
- Pharmacy order fulfillment
- Medical history tracking
- Medication adherence monitoring