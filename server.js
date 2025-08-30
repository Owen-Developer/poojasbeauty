const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const e = require('express');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const accessKey = process.env.ACCESS_KEY;
const url = "https://owen-developer.github.io/poojasbeauty";
// http://localhost:3000  redirect to url + /bookings.html?query=param....


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
db.query('SELECT 1', (err, results) => {
    if (err) console.error('Error running query:', err);
    else console.log('Database is working');
});

const store = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT // 24642 or 3306
});

app.use(cors({
    origin: 'https://owen-developer.github.io',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

app.use(session({
    store,
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, 
    secure: true,       // HTTPS only
    sameSite: 'none'    // allow cross-site cookies
    }
}));

app.use(express.static('docs'));

////////////////////////// REUSABLE FUNCTIONS LOGIC ///////////////////////////
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});
function sendClientEmail(userEmail, date, time, email, message, services, price){ 
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'New Booking', // Subject line
        text: `Hello, a booking was made for poojasbeautysalon for: ${date}, ${time}\n\nEmail: ${email}\n\nMessage: ${message}\n\nServices: ${services.replace(/,,/g, ", ")}\n\nPrice: ${price}`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendClientFree(userEmail, date, time, email, message, code, services) { 
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'New Booking', // Subject line
        text: `Hello, a booking was made for poojasbeautysalon for: ${date}, ${time}\n\nEmail: ${email}\n\nMessage: ${message}\n\nVoucher code: ${code}\n\nServices: ${services.replace(/,,/g, ", ")}\n\nThis booking was made using a voucher.`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendClientStore(userEmail, date, time, email, message, services) { 
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'New Booking', // Subject line
        text: `Hello, a booking was made for poojasbeautysalon for: ${date}, ${time}\n\nEmail: ${email}\n\nMessage: ${message}\n\nServices: ${services.replace(/,,/g, ", ")}\n\nThis booking it to be paid in store.`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendClientGiftRequest(email, price){
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: process.env.ADMIN_EMAIL,                 // Receiver's email
        subject: 'Gift Card Purchase', // Subject line
        text: `Hello, a gift card purchase was made for poojas beauty salon with the email: ${email}, for £${price}.`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendUserVoucher(userEmail, Giftcode) {  
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'Claim Your Voucher', // Subject line
        text: `Hello, thank you for purchasing a voucher at Pooja's Beauty Salon. Use this code at checkout: ${Giftcode}`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendUserEmail(userEmail, date, time, link) {  
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'Booking Confirmed', // Subject line
        text: `Hello, you made a booking for poojasbeautysalon: ${date}, ${time}\n\nCancel anytime with this link: ${link}`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendUserFree(userEmail, date, time, link){
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: userEmail,           
        subject: 'Booking Confirmed',
        text: `Hello, you made a booking for poojasbeautysalon: ${date}, ${time}\n\nCancel anytime with this link: ${link}`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendApologyEmail(userEmail, date){  
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'Booking Cancelled', // Subject line
        html: `<p>Sorry, your booking for poojasbeautysalon on ${date} has been cancelled due to a schedule change. Please and rebook at your convenience.</p>`,
        text: `Sorry, your booking for poojasbeautysalon on ${date} has been cancelled due to a schedule change. Please and rebook at your convenience.`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendClientForm(name, email, phone, message){
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: process.env.ADMIN_EMAIL,                 // Receiver's email
        subject: 'Booking Cancelled', // Subject line
        text: `Hello, a contact form was submitted from Pooja's Beauty Salon's website:\n\nName: ${name}\n\nEmail: ${email}\n\nPhone Number: ${phone}\n\nMessage: ${message}`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function sendClientDelete(date){  
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: process.env.ADMIN_EMAIL,                 // Receiver's email
        subject: 'Booking Cancelled', // Subject line
        html: `<p>A booking for Pooja's Beauty Salon was cancelled by the user for: ${date}</p>`,
        text: `A booking for Pooja's Beauty Salon was cancelled by the user for: ${date}`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
function isValidEmail(email){
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
function generateNumber(){
    return crypto.randomBytes(5).toString('hex'); 
}
function requireAdmin(req, res, next){
    if(!req.session.admin){
        return res.json({ message: 'Unauth' });
    }
    next();
}
///////////////////////////////////////////////////////////////////////////////



////////////////////////// APIS ROUTES //////////////////////////
app.post("/api/book-appointment", async (req, res) => {
    const date = req.body.date;
    const time = req.body.time;
    const email = req.body.email;
    const message = req.body.message;
    const code = req.body.code;
    const services = req.body.services;
    const price = req.body.price;
    const type = req.body.type;
    const applied = req.body.applied;
    const timeTaken = req.body.totalTime;

    if(!isValidEmail(email)){
        return res.json({ message: 'failed' });
    }

    const cancelCode = generateNumber();
    const cancelLink = url + "/bookings.html?cancel=" + cancelCode;

    if(req.body.inStore){
        let values = [];
        let emailFinish;
        for(let i = 0; i < timeTaken; i++){
            let finishTime = null;
            let minNum = Number(time.slice(3, 5));
            let newTime = time.slice(0, 3) + String(minNum + (15 * i));
            if(minNum + (15 * i) > 45){
                let exceed = Math.floor((minNum + (15 * i)) / 60);
                newTime = String(Number(time.slice(0, 2)) + exceed) + ":" + String((minNum + (15 * i)) - (60 * exceed));
                if(String((minNum + (15 * i)) - (60 * exceed)) == "0"){
                    newTime = newTime + "0";
                }
            }
            let rowType = "filler";
            if(i == 0){
                rowType = "user";
                newTime = time;

                let lastTime = time.slice(0, 3) + String(minNum + (15 * (timeTaken - 1)));
                if(minNum + (15 * (timeTaken - 1)) > 45){
                    let exceed = Math.floor((minNum + (15 * (timeTaken - 1))) / 60);
                    lastTime = String(Number(time.slice(0, 2)) + exceed) + ":" + String((minNum + (15 * (timeTaken - 1))) - (60 * exceed));
                    if(String((minNum + (15 * i)) - (60 * exceed)) == "0"){
                        lastTime = lastTime + "0";
                    }
                }
                finishTime = lastTime.slice(0, 3) + String(Number(lastTime.slice(3)) + 15);
                if((Number(lastTime.slice(3)) + 15) == 60){
                    finishTime = String(Number(lastTime.slice(0, 2)) + 1) + ":00";
                }
                emailFinish = finishTime;
            }
            values.push([date, newTime, email, message, code, services, rowType, price, cancelCode, "Paid Online (Voucher)", timeTaken, finishTime]);
        }

        sendClientStore(process.env.ADMIN_EMAIL, date, time + " - " + emailFinish, email, message, services);
        sendUserFree(email, date, time + " - " + emailFinish, cancelLink);

        const insertQuery = "insert into bookings (booking_date, booking_time, email, message, coupon_code, services, booking_type, price, cancel_code, payment_status, time_taken, finish_time) values ?";
        db.query(insertQuery, [values], (err, result) => {
            if(err){
                console.error("Error updating booking: ", err);
                return res.json({ message: 'failed' });
            }

            return res.json({ message: 'success' });
        });
    } else if(applied){
        db.query("select * from codes where coupon_code = ?", [code], (err, result) => {
            if(err){
                console.error("Error selecting codes: " + err);
            }

            let values = [];
            let emailFinish;
            for(let i = 0; i < timeTaken; i++){
                let finishTime = null;
                let minNum = Number(time.slice(3, 5));
                let newTime = time.slice(0, 3) + String(minNum + (15 * i));
                if(minNum + (15 * i) > 45){
                    let exceed = Math.floor((minNum + (15 * i)) / 60);
                    newTime = String(Number(time.slice(0, 2)) + exceed) + ":" + String((minNum + (15 * i)) - (60 * exceed));
                    if(String((minNum + (15 * i)) - (60 * exceed)) == "0"){
                        newTime = newTime + "0";
                    }
                }
                let rowType = "filler";
                if(i == 0){
                    rowType = "user";
                    newTime = time;

                    let lastTime = time.slice(0, 3) + String(minNum + (15 * (timeTaken - 1)));
                    if(minNum + (15 * (timeTaken - 1)) > 45){
                        let exceed = Math.floor((minNum + (15 * (timeTaken - 1))) / 60);
                        lastTime = String(Number(time.slice(0, 2)) + exceed) + ":" + String((minNum + (15 * (timeTaken - 1))) - (60 * exceed));
                        if(String((minNum + (15 * i)) - (60 * exceed)) == "0"){
                            lastTime = lastTime + "0";
                        }
                    }
                    finishTime = lastTime.slice(0, 3) + String(Number(lastTime.slice(3)) + 15);
                    if((Number(lastTime.slice(3)) + 15) == 60){
                        finishTime = String(Number(lastTime.slice(0, 2)) + 1) + ":00";
                    }
                    emailFinish = finishTime;
                }
                values.push([date, newTime, email, message, code, services, rowType, price, cancelCode, "Paid Online (Voucher)", timeTaken, finishTime]);
            }

            let newValue = result[0].value - Number(price.slice(1));
            const insertQuery = "insert into bookings (booking_date, booking_time, email, message, coupon_code, services, booking_type, price, cancel_code, payment_status, time_taken, finish_time) values ?";
            db.query(insertQuery, [values], (err, result) => {
                if(err){
                    console.error("Error updating booking: ", err);
                    return res.json({ message: 'failed' });
                }

                const updateValueQuery = "update codes set value = ? where coupon_code = ?";
                db.query(updateValueQuery, [newValue, code], (err, result) => {
                    if(err){
                        console.error("Error updating gift value: " + err);
                    }

                    sendClientFree(process.env.ADMIN_EMAIL, date, time + " - " + emailFinish, email, message, code, services);
                    sendUserFree(email, date, time + " - " + emailFinish, cancelLink);
                    return res.json({ message: 'success' });
                });
            });
        });
    } else {
        async function payProduct(){
            let productPriceMap = {
                "product_1": "price_1RyGREIO0M0lx6yNWh1fONaP", // chin
                "product_2": "price_1RyGUIIO0M0lx6yN1DREpeSw", // chin
                "product_3": "price_1RyGUqIO0M0lx6yNTotKK3v3", // chin
                "product_4": "price_1RyGV8IO0M0lx6yNpGZkVsq0", // chin
                "product_5": "price_1RyGVhIO0M0lx6yNXpiJMasP", // chin
                "product_6": "price_1RyGVxIO0M0lx6yNbea3WkaJ", // chin
                "product_7": "price_1RyGWeIO0M0lx6yN5o9Op4oQ", // chin
                "product_8": "price_1RyGXQIO0M0lx6yNYNnDiYiH", // chin
                "product_9": "price_1RyGXhIO0M0lx6yNqpaOYeBX", // chin
                "product_10": "price_1RyGY2IO0M0lx6yNWLZbeoF8", // chin
                "product_11": "price_1RyGYYIO0M0lx6yN2u3EZ9bN", // chin
                "product_12": "price_1RyGYmIO0M0lx6yN8cTD5B2s", // chin
                "product_13": "price_1RyGZ1IO0M0lx6yNkPtjbGGl", // chin
                "product_14": "price_1RyGZCIO0M0lx6yNsCxzz6Eg", // chin
                "product_15": "price_1RyGZlIO0M0lx6yNLKU3owY4", // chin
                "product_16": "price_1RyGZvIO0M0lx6yNCZlidYfH", // chin
                "product_17": "price_1RyGaFIO0M0lx6yNYn67q07P", // chin
                "product_18": "price_1RyGaUIO0M0lx6yNOKldur2K", // chin
                "product_19": "price_1RyGasIO0M0lx6yNncimM5GY", // chin
                "product_20": "price_1RyGb4IO0M0lx6yNpBoHM4WJ", // chin
                "product_21": "price_1RyGbTIO0M0lx6yNXRQVWnMZ", // chin
                "product_22": "price_1RyGbsIO0M0lx6yNl12eGnXY", // chin
                "product_23": "price_1RyGcCIO0M0lx6yNkL8NqI0m", // chin
                "product_24": "price_1RyGcRIO0M0lx6yNze03prdf", // chin
                "product_25": "price_1RyGckIO0M0lx6yN7A1HNajW", // chin
                "product_26": "price_1RyGd7IO0M0lx6yNBDchKEF9", // chin
                "product_27": "price_1RyGdIIO0M0lx6yNGJDGixwy", // chin
                "product_28": "price_1RyGdYIO0M0lx6yNJ8OmZEdj", // chin
                "product_29": "price_1RyGdmIO0M0lx6yNRhaYzAp4", // chin
                "product_30": "price_1RyGe5IO0M0lx6yNlHZtHTF5", // chin
                "product_31": "price_1RyGgxIO0M0lx6yNqBgzuvRX", // chin
                "product_32": "price_1RyGhBIO0M0lx6yN8FLQFyuW", // chin
                "product_33": "price_1RyGhbIO0M0lx6yNzSjy2Uli", // chin
                "product_34": "price_1RyGhqIO0M0lx6yNUsYxqSeP", // chin
                "product_35": "price_1RyGivIO0M0lx6yNQTNVBSxX", // chin
                "product_36": "price_1RyGjQIO0M0lx6yNgdOx6MqF", // chin
                "product_37": "price_1RyGjiIO0M0lx6yNCqg3Vuxn", // chin
                "product_38": "price_1RyGk1IO0M0lx6yNzG5lAy2c", // chin
                "product_39": "price_1RyGkLIO0M0lx6yN4Lvp5lxY", // chin
                "product_40": "price_1RyGkYIO0M0lx6yNDruW8XZn", // chin
                "product_41": "price_1RyGlHIO0M0lx6yNskKM2VsU", // chin
                "product_42": "price_1RyGlZIO0M0lx6yNxe7u0W7E", // chin
                "product_43": "price_1RyGlmIO0M0lx6yNqx4kKW8s", // chin
                "product_44": "price_1RyGoyIO0M0lx6yN74jOKAcD", // chin
                "product_45": "price_1RyGpFIO0M0lx6yNzIqhcr2x", // chin
                "product_46": "price_1RyGpZIO0M0lx6yNLoKCT3Wg", // chin
                "product_47": "price_1RyGqIIO0M0lx6yNCPoD2Wm4", // chin
                "product_48": "price_1RyGqgIO0M0lx6yNbjib7Uc1", // chin
                "product_49": "price_1RyGrEIO0M0lx6yNOfNX4SB7", // chin
                "product_50": "price_1RyGrYIO0M0lx6yN7Rx5h9zu", // chin
                "product_51": "price_1RyGrsIO0M0lx6yNfHJtY79x", // chin
                "product_52": "price_1RyGsFIO0M0lx6yNe1W0ORlM", // chin
                "product_53": "price_1RyGsgIO0M0lx6yN9D47J4UL", // chin
                "product_54": "price_1RyGt6IO0M0lx6yNAs9DN63o", // chin
                "product_55": "price_1RyGtMIO0M0lx6yNcV4P4I6k", // chin
                "product_56": "price_1RyGtsIO0M0lx6yNVZGhysr5", // chin
                "product_57": "price_1RyGuAIO0M0lx6yNs7HNgxDx", // chin
                "product_58": "price_1RyGuUIO0M0lx6yNRs8F3h6D", // chin
                "product_59": "price_1RyGuvIO0M0lx6yNDYbLWPwv", // chin
                "product_60": "price_1RyGv7IO0M0lx6yNRTfvXKXf", // chin
                "product_61": "price_1RyGvQIO0M0lx6yNFwo1inhU", // chin
                "product_62": "price_1RyGvgIO0M0lx6yNtCQwa9da", // chin
                "product_63": "price_1RyGw8IO0M0lx6yNvbGuEsq7", // chin
                "product_64": "price_1RyGwNIO0M0lx6yNa62JC7Lc", // chin
                "product_65": "price_1RyGwgIO0M0lx6yNhgpHj4Mw", // chin
                "product_66": "price_1RyH0ZIO0M0lx6yNYOmZF2kf", // chin
                "product_67": "price_1RyH6gIO0M0lx6yNJUIYewsr", // chin
                "product_68": "price_1RyH6zIO0M0lx6yN0nvaFDuu", // chin
                "product_69": "price_1RyH7DIO0M0lx6yNmtkO0U1B", // chin
                "product_70": "price_1RyH7qIO0M0lx6yNzRM4qgzG", // chin
                "product_71": "price_1RyH8NIO0M0lx6yNfFZv7Kg5", // chin
                "product_72": "price_1RyH90IO0M0lx6yNfr61RCYj", // chin
                "product_73": "price_1RyHE9IO0M0lx6yNOQdS9yl2", // chin
                "product_74": "price_1RyHEXIO0M0lx6yNTAWDO8IK", // chin
                "product_75": "price_1RyHF4IO0M0lx6yNnMUnkRwi", // chin
                "product_76": "price_1RyHFOIO0M0lx6yNmmdNATy3", // chin
                "product_77": "price_1RyHFuIO0M0lx6yN68TPoC0g", // chin
                "product_78": "price_1RyHGDIO0M0lx6yNv0uOerUD", // chin
                "product_79": "price_1RyHGRIO0M0lx6yNcwMjsaSS", // chin
                "product_80": "price_1RyHGnIO0M0lx6yNeju4DcC7", // chin
                "product_81": "price_1RyHHBIO0M0lx6yNXvFKEym3", // chin
                "product_82": "price_1RyHHRIO0M0lx6yNhfs8y8bW", // chin
                "product_83": "price_1RyHHfIO0M0lx6yNbSzaAH8w", // chin
            };

            try {
                let productIds = req.body.productIds;
                if (!Array.isArray(productIds)) {
                    // If single product sent, wrap it in array
                    productIds = [productIds];
                }

                // Build line_items dynamically
                const lineItems = [];
                for (const id of productIds) {
                    const priceId = productPriceMap[id];
                    if (!priceId) return res.status(400).json({ error: "Invalid product: " + id });
                    lineItems.push({ price: priceId, quantity: 1 });
                }

                // Create Stripe Checkout Session
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: lineItems,
                    mode: "payment",
                    discounts: [{coupon: "FuwYcfxr"}],
                    metadata: {
                        customer_date: date,
                        customer_time: time,
                        customer_email: email,
                        customer_message: message,
                        customer_services: services,
                        customer_type: type,
                        customer_price: price,
                        customer_cancelCode: cancelCode,
                        customer_cancelLink: cancelLink,
                        customer_timeTaken: timeTaken,
                    },
                    success_url: url + "/bookings.html?success=true&session_id={CHECKOUT_SESSION_ID}&product=true",
                    cancel_url: url + "/bookings.html?success=false",
                });

                return res.json({ message: 'continue', url: session.url });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Server error" });
            }
        }

        payProduct();
    }
});

app.post("/api/check-code", (req, res) => {
    const code = req.body.code;

    const checkQuery = "select * from codes where coupon_code = ?";
    db.query(checkQuery, [code], (err, result) => {
        if(err){
            console.error("Error checking code: " + err);
        }

        if(result.length == 0){
            return res.json({ message: 'failure' });
        } else {
            return res.json({ message: 'success', value: result[0].value });
        }
    });
});

app.post("/api/check-slots", (req, res) => {
    const date = req.body.date;

    const checkQuery = "select * from bookings where booking_date = ?";
    db.query(checkQuery, [date], (err, result) => {
        if(err){
            console.error("Error checking bookings: " + err);
        }

        let timesTaken = "";
        let daysClosed = 0;
        if(result.length > 0){
            result.forEach((row, idx) => {
                if(idx > 0){
                    timesTaken += ",," + row.booking_time.slice(0, 5);
                } else {
                    timesTaken = row.booking_time.slice(0, 5);
                }
                if(row.booking_type == "admin"){
                    daysClosed++;
                }
            }); 
            return res.json({ message: 'success', times: timesTaken, closed: daysClosed });
        } else {
            return res.json({ message: 'success', times: timesTaken, closed: daysClosed });
        }
    });
});

app.post("/api/admin-access", (req, res) => {
    const code = req.body.code;

    if(code == accessKey){
        req.session.admin = true;
        return res.json({ message: 'Success' });
    } else {
        return res.json({ message: 'Failure' });
    }
});

app.get("/api/check-admin", (req, res) => {
    if(req.session.admin){
        return res.json({ message: 'Success' });
    } else {
        return res.json({ message: 'Failure' });
    }
});

app.post("/api/get-bookings", (req, res) => {
    let likeStr;
    if(req.body.month < 10){
        likeStr = "%" + req.body.year + "-0" + String(req.body.month) + "%";
    } else {
        likeStr = "%" + req.body.year + "-" + String(req.body.month) + "%";
    }


    const getBookingsQuery = "select * from bookings where booking_date like ?";
    db.query(getBookingsQuery, [likeStr], (err, result) => {
        if(err){
            console.error("Error getting bookings: " + err);
            return res.json({ bookings: [] });
        }

        return res.json({ bookings: result });
    });
});

app.post("/api/verify-cancel", (req, res) => {
    const code = req.body.code;

    const checkQuery = "select * from bookings where cancel_code = ?";
    db.query(checkQuery, [code], (err, result) => {
        if(err){
            console.error("Error getting cancel code: " + err);
        }

        if(result.length == 0){
            return res.json({ message: 'Failure' });
        } else {
            return res.json({ message: 'Success' });
        }
    });
});

app.post("/api/delete-booking", (req, res, next) => {
    if(!req.session.admin || !req.body.user){
        return res.json({ message: 'Unauth' });
    }
    next();
}, (req, res) => {
    const code = req.body.code;

    const deleteQuery = "delete from bookings where cancel_code = ?";
    db.query(deleteQuery, [code], (err, result) => {
        if(err){
            console.error("Error deleting bookings: " + err);
        }

        db.query("select * from bookings where cancel_code = ?", [code], (err, result) => {
            if(err){
                console.error("Error selecting bookings: " + err);
            }

            sendClientDelete(result.booking_date);
            return res.json({ message: 'Success' });
        });
    });
});

app.post("/api/close-all", requireAdmin, (req, res) => {
    const date = req.body.date;

    const getEmailsQuery = "select * from bookings where booking_date = ?";
    db.query(getEmailsQuery, [date], (err, result) => {
        if(err){
            console.error("Error fetching bookings: " + err);
        }

        if(result.length > 0){
            result.forEach(obj => {
                if(obj.booking_type == "user"){
                    sendApologyEmail(obj.email, date);
                }
            });
        }

        const deleteAllQuery = "delete from bookings where booking_date = ?";
        db.query(deleteAllQuery, [date], (err, result) => {
            if(err){
                console.error("Error deleting existing bookings: " + err);
            }

            let values = [];
            let times = [
                "09:30", "09:45",
                "10:00", "10:15", "10:30", "10:45",
                "11:00", "11:15", "11:30", "11:45",
                "12:00", "12:15", "12:30", "12:45",
                "13:00", "13:15", "13:30", "13:45",
                "14:00", "14:15", "14:30", "14:45",
                "15:00", "15:15", "15:30", "15:45",
                "16:00", "16:15", "16:30", "16:45",
                "17:00", "17:15", "17:30", "17:45",
                "18:00"
            ];
            for(let i = 0; i < 35; i++){
                values.push([times[i], date, "marceauowen@gmail.com", "Not entered", "Not entered", "No Services", "admin", "£0", "n/a"]);
            }
            const closeQuery = "insert into bookings (booking_time, booking_date, email, message, coupon_code, services, booking_type, price, cancel_code) values ?";
            db.query(closeQuery, [values], (err, result) => {
                if(err){
                    console.error("Error inserting fake bookings: " + err);
                }

                return res.json({ message: 'Success' });
            });
        });    
    });
});

app.post("/api/show-bookings", requireAdmin, (req, res) => {
    const date = req.body.date;

    const getBookingsQuery = "select * from bookings where booking_date = ? and booking_type = ?";
    db.query(getBookingsQuery, [date, "user"], (err, result) => {
        if(err){
            console.error("Error getting bookings: " + err);
        }

        return res.json({ message: 'Success', arrayObjs: result });
    });
});

app.post("/api/open-day", requireAdmin, (req, res) => {
    const date = req.body.date;

    const openQuery = "delete from bookings where booking_date = ?";
    db.query(openQuery, [date], (err, result) => {
        if(err){
            console.error("Error opening day: " + err);
        }

        return res.json({ message: 'Success' });
    });
});

app.post("/api/remove-slot", requireAdmin, (req, res) => {
    const date = req.body.date; 
    const time = req.body.time; 

    const values = [time, date, "marceauowen@gmail.com", "Not entered", "Not entered", "No Services", "admin", "£0", "n/a"];
    const closeQuery = "insert into bookings (booking_time, booking_date, email, message, coupon_code, services, booking_type, price, cancel_code) values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(closeQuery, values, (err, result) => {
        if(err){
            console.error("Error removing slot: " + err);
        }

        return res.json({ message: 'Success' });
    });
});

app.get("/api/verify-booking", requireAdmin, (req, res) => {
    const changeStatusQuery = "update bookings set payment_status = ? where reference_code = ?";
    db.query(changeStatusQuery, ["verified", req.query.verify], (err, result) => {
        if(err){
            console.error("Error changing payment status: " + err);
        }

        return res.json({ message: 'success' });
    });
});

app.get("/api/verify-gift", requireAdmin, (req, res) => {
    const getVoucherQuery = "select * from codes where reference_code = ?";
    db.query(getVoucherQuery, [req.query.verifyvoucher], (err, result) => {
        if(err){
            console.error("Error getting vouchers: " + err);
            return res.json({ message: 'failure' });
        }

        if(result.length == 1){
            sendUserVoucher(result[0].email, result[0].coupon_code);
            return res.json({ message: 'success' });
        } else {
            return res.json({ message: 'failure' });
        }
    });
});

app.post("/api/submit-form", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;

    if(!message){
        message = "Not entered";
    }
    sendClientForm(name, email, phone, message);
    return res.json({ message: 'success' });
});
/////////////////////////////////////////////////////////////////


////////////////////////// STRIPE PAYMENT ROUTES //////////////////////////
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const amount = req.body.amount * 100;

    if(!isValidEmail(req.body.email)){
        return res.json({ message: 'invalid email' });
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Voucher Purchase",
            },
            unit_amount: amount, // price in cents
          },
          quantity: 1,
        },
      ],
        mode: "payment", // one-time payment
        customer_email: req.body.email,
        success_url: url + `/bookings.html?success=true&session_id={CHECKOUT_SESSION_ID}&voucherp=true`,
        cancel_url: url + "/bookings.html?success=false",
    });

    res.json({ message: 'success', url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'falied' });
  }
});

app.get("/api/verify-session", async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      res.json({ paid: true, session });
    } else {
      res.json({ paid: false, session });
    }
  } catch (err) {
    console.error("Error verifying session:", err);
    res.status(500).json({ paid: false, error: err.message });
  }
});

app.post("/api/create-gift", async (req, res) => {
    const id = req.body.id;
    const session = await stripe.checkout.sessions.retrieve(id);

    if(session.payment_status != "paid"){
        return res.json("failed");
    }

    const amount = session.amount_total / 100;
    const email = session.customer_email;
    
    const newGift = "GIFT" + generateNumber();

    db.query("select * from codes where session_id = ?", [id], (err, result) => {
        if(err){
            console.error("Error checking if session was used: " + err);
        }

        if(result.length > 0){
            return res.json({ message: 'used' });
        }

        const createGiftQuery = "insert into codes (coupon_code, code_status, value, email, session_id) values (?, ?, ?, ?, ?)";
        db.query(createGiftQuery, [newGift, "active", amount, email, id], (err, result) => {
            if(err){
                console.error("Error creating new code: " + err);
                return res.json({ message: 'failed' });
            }

            if(!isValidEmail(email)){
                return res.json({ message: 'inavlid email' });
            }

            sendUserVoucher(email, newGift);
            sendClientGiftRequest(email, amount);
            return res.json({ message: 'success' });
        });
    });
});

app.post("/api/verify-booking", async (req, res) => {
    const id = req.body.id;
    const session = await stripe.checkout.sessions.retrieve(id);

    if(session.payment_status != "paid"){
        return res.json("failed");
    }

    let timeTaken = session.metadata.customer_timeTaken;
    let values = [];
    let emailFinish;
    for(let i = 0; i < timeTaken; i++){
        let finishTime = null;
        let minNum = Number(session.metadata.customer_time.slice(3, 5));
        let newTime = session.metadata.customer_time.slice(0, 3) + String(minNum + (15 * i));
        if(minNum + (15 * i) > 45){
            let exceed = Math.floor((minNum + (15 * i)) / 60);
            newTime = String(Number(session.metadata.customer_time.slice(0, 2)) + exceed) + ":" + String((minNum + (15 * i)) - (60 * exceed));
            if(String((minNum + (15 * i)) - (60 * exceed)) == "0"){
                newTime = newTime + "0";
            }
        }
        let rowType = "filler";
        if(i == 0){
            rowType = "user";
            newTime = session.metadata.customer_time;

            let lastTime = session.metadata.customer_time.slice(0, 3) + String(minNum + (15 * (timeTaken - 1)));
            if(minNum + (15 * (timeTaken - 1)) > 45){
                let exceed = Math.floor((minNum + (15 * (timeTaken - 1))) / 60);
                lastTime = String(Number(session.metadata.customer_time.slice(0, 2)) + exceed) + ":" + String((minNum + (15 * (timeTaken - 1))) - (60 * exceed));
                if(String((minNum + (15 * i)) - (60 * exceed)) == "0"){
                    lastTime = lastTime + "0";
                }
            }
            finishTime = lastTime.slice(0, 3) + String(Number(lastTime.slice(3)) + 15);
            if((Number(lastTime.slice(3)) + 15) == 60){
                finishTime = String(Number(lastTime.slice(0, 2)) + 1) + ":00";
            }
            emailFinish = finishTime;
        }
        values.push([session.metadata.customer_date, newTime, session.metadata.customer_email, session.metadata.customer_message, null, session.metadata.customer_services, rowType, session.metadata.customer_price, session.metadata.customer_cancelCode, "Paid Online", timeTaken, finishTime]);
    }
    
    const insertQuery = "insert into bookings (booking_date, booking_time, email, message, coupon_code, services, booking_type, price, cancel_code, payment_status, time_taken, finish_time) values ?";
    db.query(insertQuery, [values], (err, result) => {
        if(err){
            console.error("Error updating booking: ", err);
            return res.json({ message: 'failed' });
        }

        sendClientEmail(process.env.ADMIN_EMAIL, session.metadata.customer_date, session.metadata.customer_time + " - " + emailFinish, session.metadata.customer_email, session.metadata.customer_message, session.metadata.customer_services, session.metadata.customer_price);
        sendUserEmail(session.metadata.customer_email, session.metadata.customer_date, session.metadata.customer_time + " - " + emailFinish, session.metadata.customer_cancelLink);
        return res.json({ message: 'success' });
    });
});
/////////////////////////////////////////////////////////////////////////////



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});