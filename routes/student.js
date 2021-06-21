const express = require('express')
const path = require('path')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const auth = require('../middleware/auth')
const Applicant = require('../model/Applicant')

const cookieParser = require('cookie-parser')

router.use(cookieParser())
router.use(express.urlencoded({ extended: false }))
router.use(express.json())

router.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/student/login.html'))
})

router.get('/logout', (req, res) => {
  res.cookie('token', undefined)
  res.cookie('userID', undefined)
  res.redirect('./login')
})

router.get('/signup', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/student/signup.html'))
})

router.get('/dashboard', auth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/student/SDashboard.html'))
})

router.get('/academics', auth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/student/StDetails.html'))
})

router.get("/getPreload", auth, async (req, res)=>{
  try{
    const userID = req.cookies.userID;
    let applicant = await Applicant.findOne({
      userID
    })
    if(applicant){
      res.status(200).json({
        error: false,
        fullname : applicant.fullname,
        email : applicant.email,
        cgpa : applicant.cgpa,
        resume : applicant.resume
      })
    }
    res.status(400).json({
      error : true
    })
  }
  catch(e){
    console.log(e);
  }
})

router.post('/details', auth, async (req, res) => {
  console.log('Loooo kelstidyaa, I am inside this /details')
  console.log('Loooo kelstidyaa, Error ilvante')
  const { fullname, email, cgpa, resume } = req.body

  console.log('Loooo kelstidyaa, about to enter try block')
  const userID = req.cookies.userID
  try {
    console.log('Loooo kelstidyaa, inside the try block')
    let applicant = await Applicant.findOne({
      userID
    })
    if (applicant) {
      console.log('Loooo kelstidyaa, hudga agle idananante')

      applicant.fullname = fullname
      applicant.email = email
      applicant.cgpa = cgpa
      applicant.resume = resume
      applicant.save()

      return res.status(200).json({
        error : false,
        msg: 'User Already Existed, so updated the user data'
      })
    }
    const offer = []
    console.log('Loooo kelstidyaa, about to commit error, nodana enagutte')
    applicant = new Applicant({
      userID,
      fullname,
      email,
      cgpa,
      resume,
      offer
    })
    console.log('Loooo kelstidyaa, can u see me')
    await applicant.save()
    console.log('Loooo kelstidyaa, save aytu lo')
    res.status(200).json({
      error: false,
      message: 'Data saved!'
    })
    // res.status(200).send("Data saved");
  } catch (e) {
    console.log(e)
    res.status(400).json({
      error: true,
      message: 'Could not save data!'
    })
    // res.status(500).send("Error in Saving");
  }
})

router.use('*', (req, res) => {
  res.send('Error 404')
})

module.exports = router
