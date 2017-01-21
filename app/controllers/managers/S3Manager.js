/**
 * Created by droidNinja on 29/06/16.
 */
/**
 * INSTALL IMAGE MAGICK
 *
 * apt-get install build-essential checkinstall && apt-get build-dep imagemagick -y
 wget http://www.imagemagick.org/download/ImageMagick.tar.gz
 tar xzvf ImageMagick.tar.gz
 ls
 cd ImageMagick<version number here>/
 ./configure
 make clean
 make
 checkinstall
 ldconfig /usr/local/lib
 * @type {exports|module.exports}
 */


const fs = require('fs');
const mime = require('mime');
const S3 = require('aws-sdk').S3;
const _ = require('lodash');
const Constants = require('../../constants/Constants');

function S3Manager(opts) {
    var bucketName = Constants.AWS.BUCKET_NAME;

    this.opts = opts || {};

    if (!bucketName) {
        throw new TypeError('Bucket name can not be undefined');
    }

    this.opts.aws = {
        secretAccessKey: Constants.AWS.SECRET_ACCESS_KEY,
        accessKeyId: Constants.AWS.ACCESS_KEY_ID,
        region: Constants.AWS.REGION
    };

    if (!this.opts.aws) { this.opts.aws = {}; }
    if (!this.opts.aws.acl) { this.opts.aws.acl = 'private'; }

    if (!this.opts.aws.httpOptions) { this.opts.aws.httpOptions = {}; }
    if (!this.opts.aws.httpOptions.timeout) {
        this.opts.aws.httpOptions.timeout = 100000;
    }

    if (!this.opts.aws.maxRetries) { this.opts.aws.maxRetries = 3; }
    if (!this.opts.aws.params) { this.opts.aws.params = {}; }
    this.opts.aws.params.Bucket = bucketName;
    if (!this.opts.aws.path) { this.opts.aws.path = ''; }
    if (!this.opts.aws.region) { this.opts.aws.region = 'us-east-1'; }
    if (!this.opts.aws.sslEnabled) { this.opts.aws.sslEnabled = true; }



    this.s3 = new S3(this.opts.aws);

    return this;
}

function UploadOptions()
{
    this.isPublic = false;
    this.fileObj = null;
}

S3Manager.prototype.upload = function(uploadOpts, done)
{
    var options = getS3Options(uploadOpts);
    if(options==null)
    {
        done(null);
        return;
    }

    this.s3.upload(options, done);

};

S3Manager.prototype.getSignedUrl = function(awsObj)
{
    var params = {Bucket: Constants.AWS.BUCKET_NAME, Key: awsObj};
    return this.s3.getSignedUrl('getObject',params);
};

var getS3Options = function(uploadOpts)
{
    var mimeType = mime.lookup(uploadOpts.fileObj.path);
    var fileType = getFileType(mimeType);

    if(fileType==null)
        return null;

    var awsKeyOptn = fileType + '/' + new Date().getTime() + '_' + uploadOpts.fileObj.originalFilename;

    return {
        Key: awsKeyOptn,
        ACL: getAclType(uploadOpts.isPublic),
        Body: fs.createReadStream(uploadOpts.fileObj.path),
        ContentType: mimeType
    };
};

var getFileType = function(mimeType)
{

    if(_.includes(Constants.FILE_TYPES.IMAGE_TYPES, mimeType))
        return Constants.FILE_TYPES.IMAGE;

    return null;
};

var getAclType = function(isPublic)
{
    return isPublic? Constants.ACL_TYPES.PUBLIC: Constants.ACL_TYPES.PRIVATE;
};



module.exports = S3Manager;
module.exports.UploadOptions = UploadOptions;