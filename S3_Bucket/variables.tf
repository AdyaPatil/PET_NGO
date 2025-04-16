variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for storing Terraform state"
  type        = string
  default     = "petngo-terraform-state-bucket"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for state locking"
  type        = string
  default     = "petngo-terraform-state-lock"
}
