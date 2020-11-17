const debug = require('debug')('linto-admin:api')
const multer = require('multer')
const fs = require('fs')

const moveFile = async function(basePath, newPath) {
    try {
        await fs.rename(basePath, newPath, function(err) {
            if (err) {
                throw err
            }
        })
        return 'success'

    } catch (error) {
        // Handle the error
        console.error(error)
        return 'error'
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/uploads`)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname)
    }
})

const uploadFile = multer({
    storage: storage
}).any()



module.exports = (webServer) => {
    return [{
        path: '/save/single',
        method: 'post',
        controller: async(req, res, next) => {
            try {

                uploadFile(req, res, async(error) => {
                    if (error ||  error instanceof multer.MulterError) {
                        // A Multer error occurred when uploading.
                        throw error
                    } else {
                        const userInfos = JSON.parse(req.body.userInfos)
                        const audioConfig = JSON.parse(req.body.audioConfig)
                        const currentPath = req.files[0].path

                        let finalPath = `${process.cwd()}/uploads/${process.env.WAKEWORD}/${userInfos.gender.value}/${audioConfig.label}`

                        // create destination folder if it doesn't exist
                        if (!fs.existsSync(finalPath)) {
                            fs.mkdirSync(finalPath, { recursive: true }, function(err) {
                                if (err) {
                                    console.error(err)
                                    res.json({ status: "ERROR! Can't create the folder!" })
                                }
                            })
                        }
                        // Move file to dedicated folder
                        finalPath += `/${req.files[0].fieldname}`
                        const moveToFolder = await moveFile(currentPath, finalPath)
                        if (moveToFolder === 'success') {
                            res.json({ status: 'success' })
                        } else {
                            throw 'File uploaded but error on moving to dedicated folder'
                        }
                    }
                })
            } catch (error) {
                console.error('catch', error)
                res.json({
                    status: 'error',
                    error,
                    msg: 'Error on saving audio file',
                })
            }
        }
    }]
}