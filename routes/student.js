const express = require("express");
const path = require("path");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const Applicant = require("../model/Applicant");

const cookieParser = require("cookie-parser");

router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../views/student/login.html"));
});

router.get("/logout", (req, res) => {
    res.cookie("token", undefined);
    res.cookie("userID", undefined);
    res.redirect("./login");
});

router.get("/signup", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../views/student/signup.html"));
});

router.get("/dashboard", auth, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../views/student/SDashboard.html"));
});

router.post(
    "/details",
    [
        check("fullname", "Please Enter a Valid Username").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("resume", "Please enter a valid password").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
		console.log(("Loooo kelstidyaa, I am inside this /details"));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
			console.log(("Loooo kelstidyaa, Error idyante"));
            return res.status(400).json({
                errors: errors.array(),
            });
        }
		console.log(("Loooo kelstidyaa, Error ilvante"));
        const {
            fullname,
            email,
            cgpa,
            resume,
        } = req.body;
        const offer = [];
		console.log(("Loooo kelstidyaa, about to enter try block"));
        const userID = req.cookies.userID;
        try {
			console.log(("Loooo kelstidyaa, inside the try block"));
            let applicant = await Applicant.findOne({
                email,
            });
            if (applicant) {
				console.log(("Loooo kelstidyaa, I am inside if block"));
                return res.status(400).json({
                    msg: "User Already Exists",
                });
            }
			console.log(("Loooo kelstidyaa, about to commit error, nodana enagutte"));
            applicant = new Applicant({
                userID,
                fullname,
                email,
                cgpa,
                resume,
                offer,
            });
			console.log(("Loooo kelstidyaa, can u see me"));
            await applicant.save();
            console.log(("Loooo kelstidyaa, save aytu lo"));
			res.status(200).send("Data saved");
        } catch (e) {
            console.log(e);
            res.status(500).send("Error in Saving");
        }
    }
);

router.use("*", (req, res) => {
    res.send("Error 404");
});

module.exports = router;
