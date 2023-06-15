const express = require("express")
const path = require("path")
const app = express()
const multer = require('multer')
const {mergePdfs} = require('./merge')
let fs = require('fs')

let upload = multer({ dest: 'uploads/' })
console.log("up",upload);
app.use('/static', express.static('public'))
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'template/index.html'))
})

app.post('/merge', upload.array('pdfs', 2), async (req, res, next)=> {
    console.log((req.files).length);
    let d = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));
    res.redirect(`https://pdfimerger.onrender.com/static/${d}.pdf`)
    setTimeout(() => {
        fs.unlinkSync(`./public/${d}.pdf`);
        fs.unlinkSync(`./uploads/${req.files[0].filename}`);
        fs.unlinkSync(`./uploads/${req.files[1].filename}`);
    }, 500);
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
