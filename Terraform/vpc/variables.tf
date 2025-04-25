variable "region" {
  description = "AWS region"
  default     = "ap-south-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDRs"
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "private_subnets" {
  description = "List of private subnet CIDRs"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "azs" {
  description = "List of availability zones"
  default     = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
}

variable bucket_name {
  type        = string
  default     = "petngo-infra-bucket"
  description = "terraform backend s3 bucket"
}

variable profile {
  type        = string
  default     = "default"
  description = "aws profile for creation"
}