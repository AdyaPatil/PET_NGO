variable region {
  type        = string
  default     = "ap-south-1"
  description = "instance region"
}

variable ami_id {
  type        = string
  default     = "ami-0f5ee92e2d63afc18"
  description = "ami image id"
}

variable instance_type {
  type        = string
  default     = "t3.xlarge"
  description = "instance type"
}

variable ssh_key_name {
  type        = string
  default     = "dmumbai"
  description = "ssh key pair to login to instance"
}

variable bucket_name {
  type        = string
  default     = "petngo-infra-bucket"
  description = "s3 bucket for terraform backend"
}

variable profile {
  type        = string
  default     = "dev"
  description = "aws profile to be used for resource provisioning"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "private_subnet_id" {
  type        = list(string)
  description = "Private subnet IDs"
}

variable "public_subnet_id" {
  type        = list(string)
  description = "Public subnet IDs"
}