variable "region" {
  type = string
  description = "defualt region"
  default     = "ap-south-1"
}

variable "cluster_name" {
  type = string
  description = "EKS Cluster name"
  default     = "pet-ngo-cluster"
}

variable bucket_name {
  type        = string
  default     = "petngo-infra-bucket"
  description = "backend configuration with s3"
}

variable controle_plane_iam_role {
  type        = string
  default     = "arn:aws:iam::340752823814:role/eksclustercontrolplanerole"
  description = "IAM role for control plane"
}

variable eks_version {
  type        = string
  default     = "1.31"
  description = "eks version to be deployed"
}

variable workernode_iam_role {
  type        = string
  default     = "arn:aws:iam::340752823814:role/workernoderole"
  description = "IAM role for worker nodes"
}

variable ssh_key_name {
  type        = string
  default     = "dmumbai"
  description = "ssh key for logging in to worker nodes"
}

variable "node_instance_type" {
  type = string
  description = "EC2 instance type for worker nodes"
  default     = "t3.medium"
}

variable workernode_storage {
  type        = number
  default     = 30
  description = "disk allocated to worker nodes"
}

variable "desired_capacity" {
  type = number
  description = "Desired number of worker nodes"
  default     = 2
}

variable "max_capacity" {
  type = number
  description = "Maximum number of worker nodes"
  default     = 3
}

variable "min_capacity" {
  type = number
  description = "Minimum number of worker nodes"
  default     = 1
}

variable profile {
  type        = string
  default     = "defualt"
  description = "aws resource creation profile"
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



