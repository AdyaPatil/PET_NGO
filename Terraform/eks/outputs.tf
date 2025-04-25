output cluster_url {
  value       = aws_eks_cluster.ekscluster.endpoint
  sensitive   = true
  description = "eks cluster url"
}

output "vpc_id" {
  value = var.vpc_id
  description = "VPC ID being passed into the EKS module"
}

output "private_subnet_id" {
  value = var.private_subnet_id
  description = "Private Subnet IDs being passed into the EKS module"
}

output "public_subnet_id" {
  value = var.public_subnet_id
  description = "Public Subnet IDs being passed into the EKS module"
}
