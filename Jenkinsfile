pipeline {
    agent any

    environment {
        IMAGE_NAME = 'adyapatil/petngo-frontend'
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds' // Jenkins Credentials ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/AdyaPatil/PET_NGO.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:latest")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }

        stage('Trigger ArgoCD Sync') {
            steps {
                sh '''
                curl -X POST $ARGOCD_WEBHOOK_URL
                '''
            }
        }
    }
}
