// Test file to verify imports work correctly
import { SuperAdminHome, UserHome } from "./apps/exporter";

console.log('SuperAdminHome:', typeof SuperAdminHome);
console.log('UserHome:', typeof UserHome);

if (typeof SuperAdminHome === 'function') {
  console.log('SuperAdminHome import successful');
} else {
  console.log('SuperAdminHome import failed');
}

if (typeof UserHome === 'function') {
  console.log('UserHome import successful');
} else {
  console.log('UserHome import failed');
}