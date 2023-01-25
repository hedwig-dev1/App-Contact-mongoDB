// NPM
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override')


// Koneksi
require('./utils/db')

// manggil model
const Contact = require('./model/contact')
const { findOne } = require('./model/contact')

const app = express()
const port = 3000

// setup method override
app.use(methodOverride('_method'))

// setup EJS
app.set('view engine', 'ejs')
// Third-party middleware
app.use(expressLayouts)
// built-ind middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended:true }))

// Konfigurasi Flash
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(flash())


// halaman home 
// app.get('/', (req, res) => {  
//     res.render('index', {
//       layout: 'layouts/main-layouts',
//       nama: 'Rijalul Akhri',
//       title: 'Halaman Home',
//     })
//   })
app.get('/', (req, res) => {

  const mahasiswa = [{
    nama: 'Rijalul akhri',
    email: 'alul.akhri@gmail.com',
  },
  {
    nama: 'Akhri',
    email: 'akhri@gmail.com',
  }
]

  res.render('index', {
    layout: 'layouts/main-layouts',
    nama: 'Rijalul Akhri',
    title: 'Halaman Home',
    mahasiswa
  })
})

  // halaman about
  app.get('/about', (req, res) => {
    res.render('about',{
      layout: 'layouts/main-layouts',
      title: 'Halaman About',
    })
  })

  // halaman contact
  app.get('/contact', async(req, res) => {

    const contacts = await Contact.find()

    res.render('contact', {
      layout: 'layouts/main-layouts',
      title: 'Halaman Contact',
      contacts,
      msg: req.flash('msg')
    })
  })

  // form tambah data 
  app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
      title: 'Form tambah data',
      layout: 'layouts/main-layouts'
    })
  })

  // proses tambah data contact
app.post('/contact',[
  body('nama').custom( async (value) => {
  const duplikat = await Contact.findOne({ nama: value })
  if(duplikat) {
    throw new Error('Nama contact sudah terdaftar');
  }
  return true
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'No hp tidak valid!').isMobilePhone('id-ID')

],  
(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Form tambah data',
        layout: 'layouts/main-layouts',
        errors: errors.array(),

      })
    } else {
      Contact.insertMany(req.body, (error, result) => {
        // flash message
        req.flash('msg', 'Data contact berhasil ditambahkan!')
        res.redirect('/contact')
      })
    }
  })

  // proses delete kontak  
  app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
      req.flash('msg', 'Data contact berhasil dihapus!')
      res.redirect('/contact')
    })
  })

  // form ubah data kontak
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama })
  res.render('edit-contact', {
    title: 'Form ubah data',
    layout: 'layouts/main-layouts',
    contact

  })
})

// proses ubah data 
app.put(
  '/contact',

[
  body('nama').custom( async (value, { req }) => {
  const duplikat = await Contact.findOne({ nama: value})

  if(value !== req.body.oldNama && duplikat) {
    throw new Error('Nama contact sudah terdaftar');
  }
  return true
  }),
  check('email', 'Email tidak tersedia!').isEmail(),
  check('nohp', 'No hp tidak valid!').isMobilePhone('id-ID')

],  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

      res.render('edit-contact', {
        title: 'Form ubah data',
        layout: 'layouts/main-layouts',
        errors: errors.array(),
        contact: req.body

      })
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
              nama: req.body.nama,
              email: req.body.email,
              nohp: req.body.nohp,
          }
        }
        ).then((result) => {
          // flash message
          req.flash('msg', 'Data contact berhasil diubah!')
          res.redirect('/contact')

        })
    }
})

  // detail
app.get('/contact/:nama', async (req, res) => {

    const contact = await Contact.findOne({ nama: req.params.nama })

    res.render('detail', {
      layout: 'layouts/main-layouts',
      title: 'Halaman detail contact',
      contact,
    })
  })


app.listen(port, () => {
    console.log(`Mongo Contact App listening at http://localhost:${port}`)
})