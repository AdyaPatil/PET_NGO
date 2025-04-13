pipeline {
  agent any

  environment {
    AWS_REGION = 'ap-south-1'
    CLUSTER_NAME = 'EcomEKSCluster'
    DOCKERHUB_USER = credentials('DOCKER_USERNAME')
    DOCKERHUB_PASS = credentials('DOCKER_PASSWORD')
    AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
  }

  stages {
    stage('Clean Previous Workspace') {
      steps {
        cleanWs()
      }
    }

    stage('Checkout Code') {
      steps {
        git branch: 'main', url: 'https://github.com/AdyaPatil/PET_NGO.git'
      }
    }
    
    stage('Inject Config Files') {
    steps {
        script {
            withCredentials([
                file(credentialsId: 'BACKEND_CONFIG_JSON', variable: 'BACKEND_CONFIG_FILE'),
                file(credentialsId: 'FRONTEND_CONFIG_JSON', variable: 'FRONTEND_CONFIG_FILE')
            ]) {
                sh '''
                mkdir -p backend
                mkdir -p frontend/config

                cp "$BACKEND_CONFIG_FILE" backend/config.json
                cp "$FRONTEND_CONFIG_FILE" frontend/config/config.json

                # Optional: Create configmaps in Kubernetes
                kubectl create configmap backend-config --from-file=backend/config.json --dry-run=client -o yaml | kubectl apply -f -
                kubectl create configmap frontend-config --from-file=frontend/config/config.json --dry-run=client -o yaml | kubectl apply -f -
                '''
            }
        }
    }
}

    stage('Create Kubernetes Secrets') {
      steps {
        sh """
          kubectl delete secret backend-config-secret --ignore-not-found
          kubectl create secret generic backend-config-secret --from-file=config.json=backend/config.json

          kubectl delete secret frontend-config-secret --ignore-not-found
          kubectl create secret generic frontend-config-secret --from-file=config.json=frontend/config/config.json
        """
      }
    }

    stage('Login to Docker Hub') {
      steps {
        sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh """
          docker build -t $DOCKERHUB_USER/pet-backend:latest ./backend

          docker build -t $DOCKERHUB_USER/pet-frontend:latest ./frontend
        """
      }
    }
    stage('Push Docker Images') {
      steps {
        sh """
          docker push $DOCKERHUB_USER/pet-backend:latest

          docker push $DOCKERHUB_USER/pet-frontend:latest
        """
      }
    }

    stage('Update Kubeconfig for EKS') {
      steps {
        sh """
          aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
          aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
          aws configure set region $AWS_REGION
          aws eks update-kubeconfig --name $CLUSTER_NAME
        """
      }
    }

    
    stage('Deploy to EKS') {
      steps {
        sh """
          kubectl apply -f k8s/backend-deployment.yaml
          kubectl apply -f k8s/backend-service.yaml
          kubectl apply -f k8s/frontend-deployment.yaml
          kubectl apply -f k8s/frontend-service.yaml
        """
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
