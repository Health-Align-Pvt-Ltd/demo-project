# Admin App

This is the admin application for the HealthAlign platform.

## Structure

- `src/` - Main source code
  - `App.jsx` - Main application component
  - `main.jsx` - Entry point
  - `components/` - Admin-specific components
  - `contexts/` - Authentication context
  - `hooks/` - Custom hooks
  - `utils/` - Utility functions

## Using Core Package

This app uses the `@health-align/core` package for shared services:

### Firebase Services
```javascript
import { authService, firestoreService } from '@health-align/core/firebase';
```

### Common UI Components
```javascript
import Button from '@health-align/core/ui/Button';
import Input from '@health-align/core/ui/Input';
import Card from '@health-align/core/ui/Card';
import Modal from '@health-align/core/ui/Modal';
```

## Running the App

```bash
npm run dev
```

## Building the App

```bash
npm run build
```