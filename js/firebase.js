/* =========================================
   ملف الاتصال بقاعدة البيانات: js/firebase.js
   ========================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    onSnapshot, 
    increment 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDk5PRsHGgO-i_dIEjOw-j_BjPO9kn--GI",
  authDomain: "thuraya-platform.firebaseapp.com",
  projectId: "thuraya-platform",
  storageBucket: "thuraya-platform.firebasestorage.app",
  messagingSenderId: "1055940030867",
  appId: "1:1055940030867:web:d96f6a69a342e98c6d7866",
  measurementId: "G-2QKJEQR322"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ربط الأدوات بالنافذة
window.db = db;
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.onSnapshot = onSnapshot;
window.increment = increment;

console.log("🔥 Firebase Connected");
