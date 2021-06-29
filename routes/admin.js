// Filename : admin.js

const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const { ADMINAUTHID } = require('../config/config')
const router = express.Router()
const adauth = require('../middleware/adauth')
const Applicant = require('../model/Applicant')
const Admin = require('../model/Admin')
const Notification = require('../model/Notification')
const Company = require('../model/Company')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/login', (req, res) => {
  console.log('I am here inside route admin')
  res.sendFile(path.resolve(__dirname, '../views/admin/login.html'))
  console.log('nanu login page olage hogta edini')
})

router.get('/addrecruiters', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/AddRecruiter.html'))
})

router.get('/logout', (req, res) => {
  res.cookie('token', undefined)
  res.cookie('adminID', undefined)
  res.redirect('./login')
})

router.get('/dashboard', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/ADashboard.html'))
})

router.get('/recruiters', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/AllRec.html'))
})

router.get('/viewcandidates', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/Aviewapplicants.html'))
})

router.get('/announcements',adauth, (req, res) => {
   res.sendFile(path.resolve(__dirname,'../views/admin/AAnnouncement.html'))
})

router.get('/candidateslist/:id', adauth, async (req, res) => {
  console.log("Try olag hogtidin");
  try {
    console.log("Try olag bandidini");
    const _id = req.params.id
    console.log("company Id sikkide");
    let company = await Company.findOne({
      _id
    })
    if(!company){
      console.log("company elvante");
      res.json({
        error : true,
        msg : "No company found"
      });
    }
    console.log("company siktu nodana");
    const candidateList = company.candidates
    const toBeSent = []
    const length = candidateList.length
    for ( i = 0; i<length ; i++){
      let _id = candidateList[i].candidateID;
      try{
        const candidate = await Applicant.findOne({
          _id
        })
        let toBeAdded = {
          candidateName : candidate.fullname,
          candidateResume : candidate.resume
        }
        toBeSent.push(toBeAdded)
      }
      catch(e){
        console.log(e);
      }
    }

    res.json({
      result : toBeSent,
      error : false,
      msg : "Candidate info is successful"
    })
  } catch (e) {
    res.json({
      error : true,
      msg : "Error happend"
    })
  }
})

router.get('/reclist', adauth, async (req, res) => {
  try {
    // let listComp = await Company.find().toArray(err, do)

    // console.log('Company list is here with us')
    let listComp = await Company.find()
    // console.log('Sending the required docs')
    res.json(listComp)
  } catch (e) {
    // console.log('Error happend, c u in catch')
    res.status(400).json({
      error: true,
      msg: 'Could not fetch data, sorry :('
    })
  }
})

router.post('/getPreload', adauth, async (req, res) => {
  try {
    // const compID = req.cookies.compID
    const _id = req.body.compID
    let company = await Company.findOne({
      _id
    })
    if (company) {
      res.status(200).json({
        error: false,
        companyname: company.companyname,
        website: company.website,
        package: company.package
      })
    }
    else{
      res.status(400).json({
        error: true,
        msg : "Could not find company"
      })
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({
      error: true,
      msg : "Could not edit company"
    })
  }

})

//put
router.put('/editCompany', adauth, async (req, res) => {
  console.log('Entered edit company')
  const { compID, compName, package, website } = req.body

  const _id = compID
  console.log(_id)
  console.log('Entereing try')
  try {
    console.log('Insider try')
    let company = await Company.findOne({
      _id
    })
    console.log('company sikot eno gottila')
    if (!company) {
      console.log('Company sigtilla')
    }
    console.log('Company sikkide ansatte')
    company.companyname = compName
    company.website = website
    company.package = package
    // company.cutoff = cgpa
    company.save()
    console.log('Successful')
    res.json({
      error: false,
      msg: 'Company details edited successfully'
    })
  } catch (e) {
    res.json({
      error: true,
      msg: "Error happend, couldn't edit"
    })
  }
})

router.post('/signup', async (req, res) => {
  const { username, email, password, authId } = req.body
  try {
    if (authId != ADMINAUTHID) {
      return res.status(400).json({
        msg: 'Auth ID is incorrect'
      })
    }
    let admin = await Admin.findOne({
      email
    })
    if (admin) {
      return res.status(400).json({
        msg: 'User Already Exists'
      })
    }

    admin = new Admin({
      username,
      email,
      password
    })

    const salt = await bcrypt.genSalt(10)
    admin.password = await bcrypt.hash(password, salt)

    await admin.save()

    const payload = {
      admin: {
        id: admin.id
      }
    }

    jwt.sign(
      payload,
      'nanuadmin',
      {
        expiresIn: 10000
      },
      (err, token) => {
        if (err) throw err
        res.cookie('token', token)
        res.cookie('adminID', admin.id)
        res.status(200).json({
          adminId: admin.id,
          adminEmail: admin.email
        })
      }
    )
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Error in Saving')
  }
})

router.post('/login', async (req, res) => {
  console.log('Just entered login')
  const { email, password } = req.body
  try {
    console.log('Insider try block')
    let admin = await Admin.findOne({
      email
    })
    if (!admin) {
      console.log('Admin ilvante')
      return res.status(400).json({
        message: 'User Not Exist'
      })
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      console.log('Password sari ila lo')
      return res.status(400).json({
        error: 'true',
        message: 'Incorrect Password !'
      })
    }
    const payload = {
      admin: {
        id: admin.id
      }
    }
    console.log('sign madtidare ega')
    jwt.sign(
      payload,
      'nanuadmin',
      {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err
        res.cookie('token', token)
        res.cookie('adminID', admin.id)
        console.log('ella chennag aytu')
        res.status(200).json({
          adminId: admin.id,
          adminEmail: admin.email,
          token: token
        })
      }
    )
  } catch (e) {
    console.log('ELlo miss hoditide')
    console.error(e)
    res.status(500).json({
      message: 'Server Error'
    })
  }
})

router.post('/notifications', adauth, async (req, res) => {
  console.log('I am inside notifications nodana enagatte ')

  console.log('try block olag horag nintidini')
  try {
    const { messageto,announcement } = req.body
    console.log('nan try block olag bande')

  
   
    console.log('Loooo kelstidyaa, about to commit error, nodana enagutte')
    notification = new Notification({
      messageto,
      announcement
    })
    console.log(' can u see me')
    await notification.save()
    console.log(' save aytu lo')
    res.status(200).json({
      error: false,
      message: 'Data saved!'
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      error: true,
      message: 'Could not save data!'
    })
  }
})

router.post('/companies', adauth, async (req, res) => {
  console.log('Loooo kelstidyaa, I am inside this /companies')

  console.log('Loooo kelstidyaa, about to enter try block')
  try {
    const { companyname, website, package, cutoff } = req.body
    console.log('Loooo kelstidyaa, inside the try block')

  
    const candidates = []
    console.log('Loooo kelstidyaa, about to commit error, nodana enagutte')
    company = new Company({
      companyname,
      website,
      package,
      cutoff,
      candidates
    })
    console.log('Loooo kelstidyaa, can u see me')
    await company.save()
    console.log('Loooo kelstidyaa, save aytu lo')
    res.status(200).json({
      error: false,
      message: 'Data saved!'
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      error: true,
      message: 'Could not save data!'
    })
  }
})



router.use('*', (req, res) => {
  res.send('Error 404')
})

module.exports = router
