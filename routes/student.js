const express = require('express')
const path = require('path')
const router = express.Router()
const Company = require('../model/Company')
const Notification =require('../model/Notification')
const { check, validationResult } = require('express-validator')

const auth = require('../middleware/auth')
const Applicant = require('../model/Applicant')

const cookieParser = require('cookie-parser')
const { findOne } = require('../model/Company')

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

router.get('/companies', auth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/student/Sviewcompanies.html'))
})

router.get('/applications', auth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/student/SviewApplications.html')
  )
})

router.get('/viewAnnouncements',auth, (req, res) =>{
   res.sendFile(path.resolve(__dirname,'../views/student/SViewNotifications.html'))
})

router.get('/getPreload', auth, async (req, res) => {
  try {
    const userID = req.cookies.userID
    let applicant = await Applicant.findOne({
      userID
    })
    if (applicant) {
      res.status(200).json({
        error: false,
        fullname: applicant.fullname,
        email: applicant.email,
        cgpa: applicant.cgpa,
        resume: applicant.resume
      })
    }
    res.status(400).json({
      error: true
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/reclist', async (req, res) => {
  try {
   

    console.log('Company list is here with us')
    let listComp = await Company.find() 

    console.log('Sending the required docs')
    res.json(listComp)
    
  } catch (e) {
    console.log('Error happend, c u in catch')
    res.status(400).json({
      error: true,
      msg: 'Could not fetch data, sorry :('
    })
  }
})

router.get('/notifications', auth, async (req, res) => {
  let toBeAdded;
  const notificationList = []
  try {
    console.log('all the messages are here with us')
    let notification = await Notification.find() 
    notification.forEach(element => {
      toBeAdded = {
        msgto : element.messageto,
        message : element.announcement,
        date : element.createdAt
      }
      notificationList.push(toBeAdded)
    });
    console.log('Sending the required docs')
    // res.json(notification)
    
  } catch (e) {
    console.log('Error happend, c u in catch')
    res.status(400).json({
      error: true,
      msg: 'Could not fetch data, sorry :('
    })
  }
  res.json({
    result : notificationList,
    msg : "get message list is working"
  })

})

router.get('/applylist', auth, async (req, res) => {
  console.log("Try olag hogtidin");
  try {
    console.log("Try olag bandidini");
    const userID = req.cookies.userID
    // const userID = req.body.userID
    console.log("Used Id sikkide");
    let applicant = await Applicant.findOne({
      userID
    })
    if(!applicant){
      console.log("Applicant illante");
      res.json({
        error : true,
        msg : "No applicant found"
      });
    }
    console.log("Applicant sikbitta");
    // const toBeList = []
    const offerList = applicant.offer
   
    console.log("He He loop mugitalla");
    res.json(offerList)
  } catch (e) {
    res.send("Error anteeee")
  }
})

//put
router.put('/apply', auth, async (req, res) => {
  console.log('Annnaaa i am inside appy')
  const userID = req.cookies.userID
  const compID = req.body
  const _id = compID.compID
  console.log('About to get inside of try')
  try {
    console.log('Annaaaa try olag bande')
    let applicant = await Applicant.findOne({
      userID
    })
    console.log('Applicant aytu')
    console.log(_id)
    let company = await Company.findOne({
      _id
    })
    if (!applicant || !company) {
      console.log('Applicant ilvante')
      res.json({
        error: true,
        noApplicant: true,
        msg: 'No applicant or company found'
      })
    }
    const offer = applicant.offer

    offer.forEach(element => {
      console.log(element.offerID.compID)
      if(element.offerID.compID == company._id){
        throw err;
        console.log("Already applied");
      }
    });
    const candidates = company.candidates

    const toBeAdded = {
      offerID: compID,
      compName : company.companyname,
      status: 'pending'
    }
    const toBeAddedComp = {
      candidateID: applicant._id,
      status: 'pending'
    }

    offer.push(toBeAdded)
    candidates.push(toBeAddedComp)
    applicant.offer = offer
    company.candidates = candidates
    company.save()
    applicant.save()
    console.log('Success')
    console.log('Tension ee madkobedi')
    res.json({
      noApplicant: false,
      error: false,
      msg: `You applied to ${company.companyname}`
    })
  } catch (e) {
    console.log('Inside catch')
    res.json({
      noApplicant: false,
      error: true,
      msg: 'Could not apply or you might have already applied'
    })
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
        error: false,
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
