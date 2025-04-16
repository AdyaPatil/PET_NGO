output "s3_petngo_bucket" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "dynamodb_petngo_table" {
  value = aws_dynamodb_table.terraform_state_lock.name
}
