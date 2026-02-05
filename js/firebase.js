import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
const db = getFirestore(app);

// محاولة تفعيل الأوفلاين
try { enableIndexedDbPersistence(db); } catch (e) { console.log("Offline mode disabled"); }

// تصدير الدوال لاستخدامها في الملفات الأخرى
export { db, doc, onSnapshot, setDoc };
