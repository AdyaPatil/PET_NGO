provider "aws" {
  region = var.region
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "kiwi-destination-bucket"
    key    = "PET_NGO/Terraform-backend/terraform.tfstate"
    region = "ap-south-1"
  }
}
