import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Predefined users
const predefinedUsers = [
  {
    email: 'teacher1@d-prep.edu',
    password: 'teacher123',
    name: 'Dr. Sarah Johnson',
    role: 'teacher',
    institution: 'Delhi University',
    phone: '9876543210'
  },
  {
    email: 'teacher2@d-prep.edu',
    password: 'teacher123',
    name: 'Prof. Rajesh Kumar',
    role: 'teacher',
    institution: 'IIT Delhi',
    phone: '9876543211'
  },
  {
    email: 'teacher3@d-prep.edu',
    password: 'teacher123',
    name: 'Ms. Priya Sharma',
    role: 'teacher',
    institution: 'JNU',
    phone: '9876543212'
  },
  {
    email: 'admin@d-prep.edu',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    institution: 'D-Prep Platform',
    phone: '9876543213'
  }
];

export async function createPredefinedUsers() {
  console.log('Creating predefined users...');
  
  for (const userData of predefinedUsers) {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        institution: userData.institution,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        isPredefined: true
      });
      
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${userData.email}`);
      } else {
        console.error(`❌ Error creating ${userData.email}:`, error.message);
      }
    }
  }
  
  console.log('Predefined users creation completed!');
}

// Run this function to create the users
// createPredefinedUsers();
