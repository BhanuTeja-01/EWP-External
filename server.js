
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// Allow requests from the Angular frontend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    room: { type: Number, required: true, min: 1 },
    service: {
        type: String,
        required: true,
        enum: [
            "Room Cleaning",
            "Food Order",
            "Laundry",
            "Room Service"
        ]
    },
    details: { type: String, default: "", maxlength: 500 }
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

app.post("/api/services", async (req, res) => {
    try {
        const service = await Service.create(req.body);

        res.status(201).json({
            message: "Service request submitted successfully!",
            id: service._id
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Please enter valid service details."
            });
        }

        console.error("Save error:", error);

        res.status(500).json({
            message: "Unable to save service request."
        });
    }
});

app.get("/api/services", async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        console.error("Retrieve error:", error);

        res.status(500).json({
            message: "Unable to retrieve requests."
        });
    }
});

mongoose.connect("mongodb://127.0.0.1:27017/hotelDB")
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error("MongoDB connection failed:", error.message);
    });
