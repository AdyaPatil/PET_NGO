output cicd_server_ip {
  value       = aws_instance.cicd_server.public_ip
  description = "public ip address of cicd server"
}

output monitoring_server_ip {
  value       = aws_instance.monitoring_server.public_ip
  description = "public ip address of monitoring server"
}