const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-firebase-app.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const tempPath = req.file.path;
    const fileName = `camera/${Date.now()}.jpg`;
    const file = bucket.file(fileName);

    // Upload file to Firebase Storage
    await bucket.upload(tempPath, { destination: fileName });

    // Get public URL
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    // Store URL in Firestore
    await db.collection("cameraFeeds").doc("frontCamera").set({ url });

    // Delete local file
    fs.unlinkSync(tempPath);

    res.json({ imageUrl: url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Error uploading image.");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
