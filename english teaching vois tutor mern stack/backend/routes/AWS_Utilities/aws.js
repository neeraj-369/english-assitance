var express = require("express");
var router = express.Router();
var aws = require('aws-sdk');

aws.config.update({
    region: 'ap-south-1',
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})

router.post("/sign_s3", (req, res) => {
    const S3_BUCKET = process.env.Bucket 
    const s3 = new aws.S3();
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;

    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
    };
    console.log(s3Params)
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err) {
            console.log(err)
            res.json({
                success: false,
                error: err
            })
        }

        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`   
        };

        res.json({
            success : true,
            data:{returnData}
        })
    })
})

router.post("/getfile_s3", (req, res) => {
    const S3_BUCKET = process.env.Bucket 
    const s3 = new aws.S3();
    const fileName = req.body.fileName;
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
    }

    /* res.attachment(fileName)
    var fileStream = s3.getObject(s3Params).createReadStream();
    fileStream.pipe(res);
    console.log(fileStream) */
  
    s3.getObject(s3Params, (err, data) => {
        if(err) {
            console.log(err)
        }
        else {
            res.json(data.Body.toString('base64'))
        }
    })
})

module.exports = router;