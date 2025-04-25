module "vpc" {
  source = "./vpc"
  # any vpc inputs go here (if required)
}

module "eks" {
  source = "./eks"

  vpc_id             = module.vpc.vpc_id
  private_subnet_id  = module.vpc.private_subnet_id
  public_subnet_id   = module.vpc.public_subnet_id
}

module "ec2" {
  source = "./ec2"
  # any vpc inputs go here (if required)

  vpc_id             = module.vpc.vpc_id
  private_subnet_id  = module.vpc.private_subnet_id
  public_subnet_id   = module.vpc.public_subnet_id
}

module "s3" {
  source = "./s3"
  # any vpc inputs go here (if required)
}