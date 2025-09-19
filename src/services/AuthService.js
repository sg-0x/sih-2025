import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

let listeners = new Set();
let currentUserProfile = null;

function emitAuthChange(user) {
  currentUserProfile = user;
  const evt = new CustomEvent('authchange', { detail: { user } });
  window.dispatchEvent(evt);
  listeners.forEach((cb) => {
    try { cb(user); } catch {}
  });
}

export function getCurrentUser() {
  console.log('getCurrentUser called, returning:', currentUserProfile); // Debug log
  return currentUserProfile;
}

export function onAuthChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export async function login(email, password) {
  if (!email || !password) throw new Error('Missing credentials');
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    console.log('Login - User data from Firestore:', userData);
    console.log('Login - Email:', email);
    
    const userProfile = {
      uid: user.uid,
      email: user.email,
      role: userData?.role || inferRoleFromEmail(email),
      name: userData?.name || user.displayName || email.split('@')[0],
      institution: userData?.institution || '',
      phone: userData?.phone || ''
    };
    
    console.log('Login - Final user profile:', userProfile);
    
    emitAuthChange(userProfile);
    return userProfile;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function signup(name, email, password, role, { institution, phone } = {}) {
  if (!name || !email || !password) throw new Error('Missing details');
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const normalizedRole = role || inferRoleFromEmail(email);
    const userData = {
      name,
      email,
      role: normalizedRole,
      institution: institution || '',
      phone: phone || '',
      createdAt: new Date().toISOString()
    };
    
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.uid), userData);
    
    const userProfile = {
      uid: user.uid,
      email: user.email,
      role: normalizedRole,
      name,
      institution: institution || '',
      phone: phone || ''
    };
    
    emitAuthChange(userProfile);
    return userProfile;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function logout() {
  try {
    await signOut(auth);
    emitAuthChange(null);
  } catch (error) {
    throw new Error(error.message);
  }
}

function inferRoleFromEmail(email) {
  // Check if email contains role indicators
  if (email.includes('teacher') || email.includes('prof') || email.includes('faculty')) {
    return 'teacher';
  }
  if (email.includes('admin') || email.includes('administrator')) {
    return 'admin';
  }
  // For this app, all other users are students by default
  return 'student';
}

// Initialize auth state listener
onAuthStateChanged(auth, async (user) => {
  console.log('Firebase auth state changed:', user); // Debug log
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      console.log('User data from Firestore:', userData); // Debug log
      
      // If no user data in Firestore, create a default profile
      if (!userData) {
        console.log('No user data found in Firestore, creating default profile');
        const defaultProfile = {
          name: user.displayName || user.email.split('@')[0],
          role: inferRoleFromEmail(user.email),
          institution: '',
          phone: '',
          createdAt: new Date().toISOString()
        };
        
        // Save default profile to Firestore
        await setDoc(doc(db, 'users', user.uid), defaultProfile);
        
        const userProfile = {
          uid: user.uid,
          email: user.email,
          role: defaultProfile.role,
          name: defaultProfile.name,
          institution: defaultProfile.institution,
          phone: defaultProfile.phone
        };
        
        console.log('Created default user profile:', userProfile);
        emitAuthChange(userProfile);
      } else {
        const userProfile = {
          uid: user.uid,
          email: user.email,
          role: userData?.role || inferRoleFromEmail(user.email),
          name: userData?.name || user.displayName || user.email.split('@')[0],
          institution: userData?.institution || '',
          phone: userData?.phone || ''
        };
        
        console.log('Final user profile:', userProfile); // Debug log
        emitAuthChange(userProfile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to basic user info
      const fallbackProfile = {
        uid: user.uid,
        email: user.email,
        role: inferRoleFromEmail(user.email),
        name: user.displayName || user.email.split('@')[0],
        institution: '',
        phone: ''
      };
      console.log('Using fallback profile:', fallbackProfile);
      emitAuthChange(fallbackProfile);
    }
  } else {
    emitAuthChange(null);
  }
});




