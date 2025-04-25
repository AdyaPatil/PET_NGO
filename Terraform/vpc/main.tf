resource "aws_vpc" "devops-infra" {
  cidr_block = var.vpc_cidr

  tags = {
    Department = "devops-infra"
  }
}



resource "aws_subnet" "public_subnets" {
  count      = length(var.public_subnets)
  vpc_id     = aws_vpc.devops-infra.id
  cidr_block = element(var.public_subnets, count.index)

  tags = {
    Name = "devops-infra ${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnets" {
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.devops-infra.id
  cidr_block        = element(var.private_subnets, count.index)
  availability_zone = element(var.azs, count.index)

  tags = {
    Name = "devops-infra-private-${count.index + 1}"
  }
}


resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.devops-infra.id

  tags = {
    Department = "devops-infra"
    Name       = "igw"
  }
}


resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name       = "nat"
    Department = "devops-infra"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_subnets[1].id

  tags = {
    Name       = "de_nat"
    Department = "devops-infra"
  }

  depends_on = [aws_internet_gateway.igw]
}


resource "aws_route_table" "public_subnet_rt" {
  vpc_id = aws_vpc.devops-infra.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Department = "devops-infra"
    Name       = "Public Route table"
  }
}

resource "aws_route_table" "private_subnet_rt" {
  vpc_id = aws_vpc.devops-infra.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat.id
  }
  tags = {
    Department = "devops-infra"
    Name       = "Private Route Table"
  }
}


resource "aws_route_table_association" "public_subnet_asso" {
  count          = length(var.public_subnets)
  subnet_id      = element(aws_subnet.public_subnets[*].id, count.index)
  route_table_id = aws_route_table.public_subnet_rt.id
}

resource "aws_route_table_association" "private_subnet_asso" {
  count          = length(var.private_subnets)
  subnet_id      = element(aws_subnet.private_subnets[*].id, count.index)
  route_table_id = aws_route_table.private_subnet_rt.id
}