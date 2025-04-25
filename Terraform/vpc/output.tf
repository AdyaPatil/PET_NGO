output vpc_id {
  value       = aws_vpc.devops-infra.id
  sensitive   = false
  description = "vpc id"
}

output public_subnet_id {
  value       = aws_subnet.public_subnets[*].id
  sensitive   = false
  description = "Public subnet ids"
}

output private_subnet_id {
  value       = aws_subnet.private_subnets[*].id
  sensitive   = false
  description = "private subnet id"
}