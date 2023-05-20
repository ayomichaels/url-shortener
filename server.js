const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/url')
const app = express()
const port = process.env.PORT || 5000

mongoose.connect('mongodb://127.0.0.1/urlShortener', {
    useNewUrlParser: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/shortUrls', async (req,res)=>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})

    if (shortUrl == null) return res.status(400)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(port, ()=>{
    console.log(`server is listening on ${port}`);
})