resource "aws_security_group" "cicd_security_group"{
    name        = "cicd_server_security_group"
    description = "Allows port required for CICD server"
    vpc_id      = var.vpc_id
    ingress {
        description = "SSH port"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"]
    }
    ingress {
        description = "HTTPS port"
        from_port   =  443
        to_port     =  443
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "HTTP port"
        from_port   =  80
        to_port     =  80
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "jenkins port"
        from_port   =  8080
        to_port     =  8080
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "sonarqube port"
        from_port   =  9000
        to_port     =  9000
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "frontend port"
        from_port   =  3000
        to_port     =  3000
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "backend port"
        from_port   =  8000
        to_port     =  8000
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    egress {
        description = "outbound traffic"
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }
}



resource "aws_instance" "cicd_server"{
    instance_type =  var.instance_type
    ami           = var.ami_id
    subnet_id     = var.public_subnet_id[1]
    key_name      = var.ssh_key_name
    associate_public_ip_address = true
    vpc_security_group_ids = [aws_security_group.cicd_security_group.id]

    
    tags  = {
        Department = "petngo-infra"
        Name       = "cicd_server"
    }
}


resource "aws_security_group" "monitoring_security_group"{
    name        = "monitoring_server_security_group"
    description = "Allows port required for monitoring server"
    vpc_id      = var.vpc_id
    ingress {
        description = "SSH port"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"]
    }
    ingress {
        description = "HTTPS port"
        from_port   =  443
        to_port     =  443
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "HTTP port"
        from_port   =  80
        to_port     =  80
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "jenkins port"
        from_port   =  8080
        to_port     =  8080
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    ingress {
        description = "prometheus port"
        from_port   =  9090
        to_port     =  9090
        protocol    = "tcp"
        cidr_blocks  = ["0.0.0.0/0"] 
    }
    egress {
        description = "outbound traffic"
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }
}



resource "aws_instance" "monitoring_server"{
    instance_type =  var.instance_type
    ami           = var.ami_id
    subnet_id     = var.public_subnet_id[1]
    key_name      = var.ssh_key_name
    associate_public_ip_address = true
    vpc_security_group_ids = [aws_security_group.monitoring_security_group.id]
    tags  = {
        Department = "petngo-infra"
        Name       = "monitoring_server"
    }
}