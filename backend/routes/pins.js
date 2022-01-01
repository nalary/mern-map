const router = require('express').Router();
const Pin = require("../models/Pin");

// create a pin
router.post("/", async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update pin
router.put("/:id", async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id);
        if (pin.username === req.body.username) {
            try {
                const updatedPin = await Pin.findByIdAndUpdate(
                    req.params.id, 
                    {
                        $set: req.body
                    }, 
                    { new : true }
                );
                res.status(200).json("Pin has been updated.");
            } catch (err) {
                res.status(500).json(err);
            }            
        } else {
            res.status(401).json("You can update only your pin!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete pin
router.delete("/:id", async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id);
        if (pin.username === req.body.username) {
            try {
                await pin.delete();
                res.status(200).json("Pin has been deleted.");
            } catch (err) {
                res.status(500).json(err);
            }            
        }
        else {
            res.status(401).json("You can delete only your pin!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// get all pins
router.get("/", async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get last pin
router.get("/lastPin", async (req, res) => {
    try {
        const pin = await Pin.find().sort({ $natural: -1 }).limit(1);
        res.status(200).json(pin);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;