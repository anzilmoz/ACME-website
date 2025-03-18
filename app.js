const express = require("express");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");

const app = express();

// Whitelisted IP addresses
const WHITELISTED_IPS = ["3.248.28.214", "54.77.122.154"];

// Middleware to block non-US requests
app.use((req, res, next) => {
    const clientIp = requestIp.getClientIp(req) || "";
    
    if (WHITELISTED_IPS.includes(clientIp)) {
        return next(); // Allow whitelisted IPs
    }
    
    const geo = geoip.lookup(clientIp);
    if (!geo || geo.country !== "US") {
        return res.status(403).send("Access denied: This service is only available in the US.");
    }
    
    next();
});

// To handle HTML forms and JSON payloads
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting static folder
app.use(express.static("public"));

// Listen for port 3000
app.listen(3000, () => console.log("Server running on port 3000"));
