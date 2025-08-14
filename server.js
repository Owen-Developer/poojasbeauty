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

const accessKey = "237410";


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
function sendClientEmail(userEmail, date, time, email, message, code, services, price, refCode, link) { 
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'New Booking', // Subject line
        text: `Hello, a booking was made for poojasbeautysalon for: ${date}, ${time}\n\nEmail: ${email}\n\nMessage: ${message}\n\nCoupon code: ${code}\n\nServices: ${services.replace(",,", ", ")}\n\nPrice: ${price}\n\nMake sure that you were sent ${price} with the reference code attached in the payment: ${refCode}, then verify the booking simply by visiting this link: ${link}`,
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
function sendClientGiftRequest(email, price, code, link) {  
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: "jackbaileywoods@gmail.com",                 // Receiver's email
        subject: 'Gift Card Purchase Request', // Subject line
        text: `Hello, a gift card purchase was requested for poojas beauty salon with the email: ${email}. Verify that you were sent £${price} with the the reference code attached: ${code} simply by visiting this link: ${link}`,
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
function sendUserGiftRequest(userEmail, price, code) {  
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'Booking Requested', // Subject line
        text: `Hello, you requested a voucher from poojas beauty salon.\n\nMake sure that you have sent ${price} to the iban: ABCDEFGHIJKLMNOPQRST. Include this reference code in the message of your payment: ${code}\n\nYou will recieve an email containing your voucher code as soon as we verify your payment!`,
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
        subject: 'Booking Requested', // Subject line
        text: `Hello, your voucher payment has been verified. Use this code at checkout: ${Giftcode}`,
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
function sendUserEmail(userEmail, date, time, link, price, code) {  
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: userEmail,                 // Receiver's email
        subject: 'Booking Requested', // Subject line
        text: `Hello, you made a booking for poojasbeautysalon: ${date}, ${time}\n\nCancel anytime with this link: ${link}\n\n Make sure that you have sent ${price} to the iban: ABCDEFGHIJKLMNOPQRST. Include this reference code in the message of your payment: ${code}`,
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
app.get('/', (req, res) => {
  res.status(200).send('Server is alive');
});

app.post("/api/book-appointment", (req, res) => {
    const date = req.body.date;
    const time = req.body.time;
    const email = req.body.email;
    const message = req.body.message;
    const code = req.body.code;
    const services = req.body.services;
    const price = req.body.price;
    const type = req.body.type;

    if(!isValidEmail(email)){
        return res.json({ message: 'Failure' });
    }

    const cancelCode = generateNumber();
    const cancelLink = "https://poojasbeauty.onrender.com/bookings.html?cancel=" + cancelCode;
    const refCode = "REF" + generateNumber();
    const refLink = "https://poojasbeauty.onrender.com/bookings.html?admin=true&verify=" + refCode;

    const insertQuery = "insert into bookings (booking_date, booking_time, email, message, coupon_code, services, booking_type, price, cancel_code, payment_status, reference_code) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(insertQuery, [date, time, email, message, code, services, type, price, cancelCode, "pending", refCode], (err, result) => {
        if(err){
            console.error("Error updating booking: ", err);
            return res.json({ message: 'Failure' });
        }
    });
    sendClientEmail("jackbaileywoods@gmail.com", date, time, email, message, code, services, price, refCode, refLink);
    sendUserEmail(email, date, time, cancelLink, price, refCode);
    return res.json({ message: 'Success', code: refCode });
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
            return res.json({ message: 'success', discount: result[0].discount });
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

app.post("/api/create-gift", (req, res) => {
    const amount = req.body.amount;
    const email = req.body.email;
    
    const newGift = "GIFT" + generateNumber();
    const refCode = "REF" + generateNumber();
    const verifyLink = "https://poojasbeauty.onrender.com/bookings.html?admin=true&verify-voucher=" + refCode;

    const createGiftQuery = "insert into codes (coupon_code, code_status, value, email, reference_code) values (?, ?, ?, ?, ?)";
    db.query(createGiftQuery, [newGift, "active", amount, email, refCode], (err, result) => {
        if(err){
            console.error("Error creating new code: " + err);
            return res.json({ message: 'failure' });
        }

        if(!isValidEmail(email)){
            return res.json({ message: 'inavlid email' });
        }

        sendUserGiftRequest(email, amount, refCode, verifyLink);
        sendClientGiftRequest(email, amount, refCode);
        return res.json({ message: 'success', code: refCode });
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});