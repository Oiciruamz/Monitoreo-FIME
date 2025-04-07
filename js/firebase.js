 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyA2ua_OCt1iEi3K3rh0PzqvbX483JmaoTA",
   authDomain: "monitoreo-5a969.firebaseapp.com",
   databaseURL: "https://monitoreo-5a969-default-rtdb.firebaseio.com",
   projectId: "monitoreo-5a969",
   storageBucket: "monitoreo-5a969.firebasestorage.app",
   messagingSenderId: "385281802173",
   appId: "1:385281802173:web:526307890bece5bceedcd4",
   measurementId: "G-B776FDZQVV"
 };

 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 const database = firebase.database();

 function leerDatos() {
    database.ref('salones/-ONCA6MFmoCbVvs0Jaj9/salones/9101/').once('value').then((snapshot) => {
      console.log('Datos:', snapshot.val());
    });
  }

  leerDatos()