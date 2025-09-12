# Appointments Data Structure

## Collection Name
`appointments`

## Description
Stores information about medical appointments between patients and doctors.

## Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| patientId | string | Yes | Firebase user ID of the patient |
| doctorId | string | Yes | Firebase user ID of the doctor |
| appointmentDate | string (ISO date) | Yes | Scheduled date and time of appointment |
| status | string | Yes | Current status ('scheduled', 'completed', 'cancelled', 'rescheduled') |
| reason | string | No | Reason for the appointment |
| notes | string | No | Additional notes or symptoms |
| createdAt | string (ISO date) | Yes | Appointment creation timestamp |
| updatedAt | string (ISO date) | Yes | Last update timestamp |

## Example Document
```json
{
  "id": "appointment_123",
  "patientId": "user_patient_123",
  "doctorId": "user_doctor_456",
  "appointmentDate": "2023-06-15T14:30:00Z",
  "status": "scheduled",
  "reason": "Regular checkup",
  "notes": "Patient reports occasional headaches",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

## Usage
- Booking and managing medical appointments
- Tracking appointment history
- Sending reminders to patients and doctors
- Managing doctor schedules