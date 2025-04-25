variable region {
  type        = string
  default     = "ap-south-1"
  description = "default region to provision infra"
}


variable bucket_name {
  type        = string
  default     = "petngo-infra-bucket"
  description = "This bucket is mainly responsible for storing the terraform tfstate files."
}

variable profile {
  type        = string
  default     = "dev"
  description = "aws profile for resource creation"
}