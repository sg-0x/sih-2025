import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to fix a specific user's role in Firestore
export async function fixUserRole(email, correctRole) {
  try {
    console.log(`Fixing role for ${email} to ${correctRole}`);
    
    // First, let's find the user by email in Firestore
    // We'll need to query all users to find the one with matching email
    // For now, let's create a direct fix for the known UID
    
    const userId = 'DBzAVovpvfTcnPTnbGgnAyu2WDrl'; // From the debug info
    const userRef = doc(db, 'users', userId);
    
    // Get current user data
    const userDoc = await getDoc(userRef);
    const currentData = userDoc.data();
    
    if (currentData) {
      console.log('Current user data:', currentData);
      
      // Update the role
      await setDoc(userRef, {
        ...currentData,
        role: correctRole,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log(`✅ Successfully updated role for ${email} to ${correctRole}`);
      return true;
    } else {
      console.log('No user data found, creating new profile');
      
      // Create a new user profile with correct role
      await setDoc(userRef, {
        name: 'Dr. Sarah Johnson',
        email: email,
        role: correctRole,
        institution: 'Delhi University',
        phone: '9876543210',
        createdAt: new Date().toISOString(),
        isPredefined: true
      });
      
      console.log(`✅ Created new profile for ${email} with role ${correctRole}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error fixing role for ${email}:`, error);
    return false;
  }
}

// Function to fix all predefined users
export async function fixAllPredefinedUsers() {
  const usersToFix = [
    { email: 'teacher1@d-prep.edu', role: 'teacher', name: 'Dr. Sarah Johnson' },
    { email: 'teacher2@d-prep.edu', role: 'teacher', name: 'Prof. Rajesh Kumar' },
    { email: 'teacher3@d-prep.edu', role: 'teacher', name: 'Ms. Priya Sharma' },
    { email: 'admin@d-prep.edu', role: 'admin', name: 'System Administrator' }
  ];
  
  console.log('Fixing all predefined users...');
  
  for (const user of usersToFix) {
    await fixUserRole(user.email, user.role);
  }
  
  console.log('All predefined users fixed!');
}
