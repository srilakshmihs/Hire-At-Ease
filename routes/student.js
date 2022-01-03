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

router.get('/homepage' , (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/index.html'))
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

router.get('/videos',auth, (req, res) =>  {
  res.sendFile(path.resolve(__dirname, '../views/student/SVideos.html'))
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
   

    let listComp = await Company.find() 

    res.json(listComp)
    
  } catch (e) {
    res.status(400).json({
      error: true,
      msg: 'Could not fetch data, sorry :('
    })
  }
})

router.get('/getCGPA', async (req, res) => {
  try {
    const userID = req.cookies.userID;
    let applicant = await Applicant.findOne({
      userID
    })
    if(!applicant){
      res.json({
        error : true,
        msg : "No applicant found"
      });
    }
    const cgpa = applicant.cgpa;
    res.json({
      error : false,
      cgpa : cgpa,
    });
    
  } catch (e) {
    res.status(400).json({
      error: true,
      msg: 'Could not fetch data, sorry :('
    });
  }
})


router.get('/notifications', auth, async (req, res) => {
  let toBeAdded;
  const notificationList = []
  try {
    let notification = await Notification.find() 
    notification.forEach(element => {
      toBeAdded = {
        msgto : element.messageto,
        message : element.announcement,
        date : element.createdAt
      }
      notificationList.push(toBeAdded)
    });
    
  } catch (e) {
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
  try {
    const userID = req.cookies.userID
    let applicant = await Applicant.findOne({
      userID
    })
    if(!applicant){
      res.json({
        error : true,
        msg : "No applicant found"
      });
    }
    const toBeList = []
    const offerList = applicant.offer
    for ( let i = 0; i< offerList.length ; i++) {
      let toBeStatus;
      let _id = offerList[i].offerID.compID
      let company = await Company.findOne({
        _id
      })
      if(!company){
        continue
      }
      let candidates = company.candidates
      candidates.forEach(element2 => {
        if(element2.candidateID == applicant._id){
          toBeStatus = element2.status
        } 
      });
      let toBeAdded = {
        compName : offerList[i].compName,
        status : toBeStatus
      }
      toBeList.push(toBeAdded)
    }
    res.json(toBeList)
  } catch (e) {
    res.json({
      error : true,
      msg : "Could not fetch content at this moment"
    })
  }
})

//put




router.put('/apply', auth, async (req, res) => {
  const userID = req.cookies.userID
  const compID = req.body
  const _id = compID.compID
  try {
    let applicant = await Applicant.findOne({
      userID
    })
    let company = await Company.findOne({
      _id
    })
    if (!applicant || !company) {
      res.json({
        error: true,
        noApplicant: true,
        msg: 'No applicant or company found'
      })
    }
    const offer = applicant.offer

    offer.forEach(element => {
      if(element.offerID.compID == company._id){
        throw err;
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
    res.json({
      noApplicant: false,
      error: false,
      msg: `You applied to ${company.companyname}`
    })
  } catch (e) {
    res.json({
      noApplicant: false,
      error: true,
      msg: 'Could not apply or you might have already applied'
    })
  }
})

router.post('/details', auth, async (req, res) => {
  const { fullname, email, cgpa, resume } = req.body

  const userID = req.cookies.userID
  try {
    let applicant = await Applicant.findOne({
      userID
    })
    if (applicant) {
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
    applicant = new Applicant({
      userID,
      fullname,
      email,
      cgpa,
      resume,
      offer
    })
    await applicant.save()
    res.status(200).json({
      error: false,
      message: 'Data saved!'
    })
    // res.status(200).send("Data saved");
  } catch (e) {
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
