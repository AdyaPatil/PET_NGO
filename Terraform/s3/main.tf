resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.bucket_name

  tags = {
    Name        = "S3Bucket"
    Department = "DevOps_infra"
  }
}

resource "aws_s3_object" "base_folder"{
    bucket  = aws_s3_bucket.s3_bucket.id
    acl     = "private"
    key     =  "terraform/backend/"
   
  }


resource "aws_s3_bucket_versioning" "terraform_state_versioning" {
  bucket = aws_s3_bucket.s3_bucket.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

