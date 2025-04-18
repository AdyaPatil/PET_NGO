output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "node_group_role_arn" {
  value = module.eks.eks_managed_node_groups.default.iam_role_arn
}

output "monitoring_public_ip" {
  value = aws_instance.monitoring.public_ip
}

output "cicd_public_ip" {
  value = aws_instance.cicd.public_ip
}

output "ec2_security_group_id" {
  value = aws_security_group.ec2_sg.id
}
