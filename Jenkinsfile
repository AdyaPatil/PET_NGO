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

      stage('Debug Sonar Environment') {
          steps {
                sh '''
                if [ -d "${SONARQUBE_SCANNER_HOME}/bin" ]; then 
                    echo "Sonar Scanner found"; 
                else 
                    echo "Sonar Scanner not found"; 
                    exit 1; 
                fi
                echo "SonarQube URL: ${SONAR_URL}"
                echo "SonarQube Token: ${SONAR_TOKEN}"
                '''
          }
      }

      stage('SonarQube Analysis') {
            environment {
                SONARQUBE_SCANNER_HOME = tool 'SonarScanner'
            }
            steps {
                withCredentials([string(credentialsId: 'sonarToken', variable: 'SONAR_TOKEN'),
                                 string(credentialsId: 'sonarIP', variable: 'SONAR_URL')]) {
                    script {
                        dir('frontend') {
                            sh '''
                            ${SONARQUBE_SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectKey=pet-ngo-frontend \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.exclusions="**/node_modules/**,**/build/**" \
                            -X
                            '''
                        }

                        dir('backend') {
                            sh '''
                            ${SONARQUBE_SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectKey=pet-front-backend \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.exclusions="**/migrations/**,**/__pycache__/**,**/venv/**" \
                            -X
                            '''
                        }
                    }
                }
            }
        }

    stage('SonarQube Quality Gate') {
       steps {
         timeout(time: 20, unit: 'MINUTES') {
           waitForQualityGate abortPipeline: true
        }
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

    stage('Verify Trivy') {
    steps {
        sh 'trivy --version'
    }
}


    stage('Trivy Scan for Vulnerabilities') {
            steps {
                script {
                    echo "Running Trivy Scan for Frontend Image..."
                    sh """
                    trivy image $DOCKERHUB_USER/pet-frontend:latest --severity HIGH,CRITICAL --exit-code 1 -f json -o trivy-frontend-report.json || echo "Vulnerabilities found!"
                    """

                    echo "Running Trivy Scan for Backend Image..."
                    sh """
                    trivy image $DOCKERHUB_USER/pet-backend:latest --severity HIGH,CRITICAL --exit-code 1  -f json -o trivy-backend-report.json || echo "Vulnerabilities found!"
                    """
                }
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
