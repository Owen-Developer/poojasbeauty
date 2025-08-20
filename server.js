const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const e = require('express');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const accessKey = "237410";
const url = "https://poojasbeauty.onrender.com";
// http://localhost:3000


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
/*
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});
*/

const store = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT // 24642 or 3306
});
app.use(session({
    store,
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
  maxAge: 86400000
}
}));

app.use(express.static('public'));

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
        text: `Hello, a booking was made for poojasbeautysalon for: ${date}, ${time}\n\nEmail: ${email}\n\nMessage: ${message}\n\nServices: ${services.replace(",,", ", ")}\n\nPrice: ${price}`,
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
        text: `Hello, a booking was made for poojasbeautysalon for: ${date}, ${time}\n\nEmail: ${email}\n\nMessage: ${message}\n\nVoucher code: ${code}\n\nServices: ${services.replace(",,", ", ")}\n\nThis booking was made using a voucher.`,
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
        to: "jackbaileywoods@gmail.com",                 // Receiver's email
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
        html: `<p>Sorry, your booking for poojasbeautysalon on ${date} has been cancelled due to a schedule change. Please refund and rebook at your convenience.</p>`,
        text: `Sorry, your booking for poojasbeautysalon on ${date} has been cancelled due to a schedule change. Please refund and rebook at your convenience.`,
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

    if(!isValidEmail(email)){
        return res.json({ message: 'failed' });
    }

    const cancelCode = generateNumber();
    const cancelLink = url + "/bookings.html?cancel=" + cancelCode;

    if(applied){
        sendClientFree("jackbaileywoods@gmail.com", date, time, email, message, code, services);
        sendUserFree(email, date, time, cancelLink);
        db.query("select * from codes where coupon_code = ?", [code], (err, result) => {
            if(err){
                console.error("Error selecting codes: " + err);
            }

            let newValue = result[0].value - Number(price.slice(1));
            const insertQuery = "insert into bookings (booking_date, booking_time, email, message, coupon_code, services, booking_type, price, cancel_code) values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(insertQuery, [date, time, email, message, code, services, type, price, cancelCode], (err, result) => {
                if(err){
                    console.error("Error updating booking: ", err);
                    return res.json({ message: 'failed' });
                }

                const updateValueQuery = "update codes set value = ? where coupon_code = ?";
                db.query(updateValueQuery, [newValue, code], (err, result) => {
                    if(err){
                        console.error("Error updating gift value: " + err);
                    }

                    return res.json({ message: 'success' });
                });
            });
        });
    } else {
async function payProduct() {
    let productPriceMap = {
        "product_4": "price_1RxietIO0M0lx6yNP46TImTe", // chin
        "product_5": "price_1RxietIO0M0lx6yNP46TImTe" // example
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
            return res.json({ message: 'failure', times: timesTaken});
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

        return res.json({ message: 'Success' });
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
                sendApologyEmail(obj.email, date);
            });
        }

        const deleteAllQuery = "delete from bookings where booking_date = ?";
        db.query(deleteAllQuery, [date], (err, result) => {
            if(err){
                console.error("Error deleting existing bookings: " + err);
            }

            let values = [];
            let times = ["09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00", "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00", "18:00:00"];
            for(let i = 0; i < 18; i++){
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

app.post("/api/mark-paid", requireAdmin, (req, res) => {
    const id = req.body.id;

    const markQuery = "update bookings set payment_status = ? where id = ?";
    db.query(markQuery, ["verified", id], (err, result) => {
        if(err){
            console.error("Error updating booking status: " + err);
            return res.json({ message: 'failure' });
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
/////////////////////////////////////////////////////////////////


////////////////////////// STRIPE PAYMENT ROUTES //////////////////////////
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const amount = req.body.amount * 100;

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
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
        success_url: url + `/bookings.html?success=true&session_id={CHECKOUT_SESSION_ID}&voucher=true`,
        cancel_url: url + "/bookings.html?success=false",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
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
    
    const insertQuery = "insert into bookings (booking_date, booking_time, email, message, coupon_code, services, booking_type, price, cancel_code) values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(insertQuery, [session.metadata.customer_date, session.metadata.customer_time, session.metadata.customer_email, session.metadata.customer_message, "Not entered", session.metadata.customer_services, session.metadata.customer_type, session.metadata.customer_price, session.metadata.customer_cancelCode], (err, result) => {
        if(err){
            console.error("Error updating booking: ", err);
            return res.json({ message: 'failed' });
        }

        sendClientEmail("jackbaileywoods@gmail.com", session.metadata.customer_date, session.metadata.customer_time, session.metadata.customer_email, session.metadata.customer_messages, session.metadata.customer_services, session.metadata.customer_price);
        sendUserEmail(session.metadata.customer_email, session.metadata.customer_date, session.metadata.customer_time, session.metadata.customer_cancelLink);
        return res.json({ message: 'success' });
    });
});
/////////////////////////////////////////////////////////////////////////////



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});