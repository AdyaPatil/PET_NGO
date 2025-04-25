resource "aws_security_group" "controle_plane_security_group" {
  name        = "controle_plane_security_group"
  description = "Security group for the elastic network interfaces between the control plane and the worker nodes"
  vpc_id      = var.vpc_id  # Direct reference to the existing VPC
}

resource "aws_security_group_rule" "ControlPlaneIngressFromWorkerNodesHttps" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  source_security_group_id = aws_security_group.controle_plane_security_group.id
  security_group_id = aws_security_group.controle_plane_security_group.id
}


resource "aws_security_group_rule" "ControlPlaneEgressToWorkerNodesKubelet" {
  type              = "egress"
  from_port         = 10250
  to_port           = 10250
  protocol          = "tcp"
  source_security_group_id = aws_security_group.controle_plane_security_group.id
  security_group_id = aws_security_group.controle_plane_security_group.id
}
resource "aws_security_group_rule" "ControlPlaneEgressToWorkerNodesHttps" {
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  source_security_group_id = aws_security_group.controle_plane_security_group.id
  security_group_id = aws_security_group.controle_plane_security_group.id
}

# =============================================================================
resource "aws_security_group" "worker_node_security_group"{
  name = "worker_node_security_group"
  description = "Security group for all the worker nodes"
  vpc_id      = var.vpc_id
}

resource "aws_security_group_rule" "WorkerNodesIngressFromWorkerNodes" {
  type              = "ingress"
  protocol          = "all"
  from_port         = 0
  to_port           = 0
  source_security_group_id = aws_security_group.worker_node_security_group.id
  security_group_id = aws_security_group.worker_node_security_group.id
}

resource "aws_security_group_rule" "WorkerNodesIngressFromControlPlaneKubelet" {
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 10250
  to_port           = 10250
  source_security_group_id = aws_security_group.worker_node_security_group.id
  security_group_id = aws_security_group.worker_node_security_group.id
}


resource "aws_security_group_rule" "WorkerNodesIngressFromControlPlaneHttps" {
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 443
  to_port           = 443
  source_security_group_id = aws_security_group.worker_node_security_group.id
  security_group_id = aws_security_group.worker_node_security_group.id
  
}
# ==========================================================================
resource "aws_security_group" "ssh_login_security_group"{
  name = "worker_node_security_group for ssh login"
  description = "Security group for all the worker nodes"
  vpc_id      = var.vpc_id

  ingress {
    from_port = 22
    protocol  =  "tcp"
    to_port   = 22
    cidr_blocks = ["10.168.0.0/16"]
  }
  egress{
    from_port = 0
    to_port   = 0
    protocol  = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# ==================Controle plane creation ============================#



resource "aws_eks_cluster" "ekscluster" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.eks_version

  vpc_config {
    subnet_ids = var.private_subnet_id  # Direct reference to the private subnets
    security_group_ids = [aws_security_group.controle_plane_security_group.id]
  }
}


#==========================Workernodescreation=================================
resource "aws_eks_node_group" "private-nodes" {
  cluster_name    = aws_eks_cluster.ekscluster.name
  node_group_name = join("-", [var.cluster_name, "workernodes"])
  node_role_arn   = aws_iam_role.workernoderole.arn


  subnet_ids = var.private_subnet_id  # Direct reference to the private subnets

  remote_access {
    source_security_group_ids = [aws_security_group.ssh_login_security_group.id]
    ec2_ssh_key               = var.ssh_key_name

  }

  capacity_type  = "ON_DEMAND"
  instance_types = [var.node_instance_type]
  disk_size      =  var.workernode_storage


  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.max_capacity
    min_size     = var.min_capacity
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    role = var.cluster_name
  }
}