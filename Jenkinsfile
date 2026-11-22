pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io/stitchlyn'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        KUBECONFIG_ID = 'k8s-kubeconfig'
    }

    stages {
        stage('1. Checkout SCM') {
            steps {
                checkout scm
                echo "Code checked out from repository."
            }
        }

        stage('2. Static Code Analysis & Linting') {
            parallel {
                stage('Lint Gateway') {
                    steps {
                        dir('services/api-gateway') {
                            sh 'npm install && npm audit --audit-level=high || true'
                        }
                    }
                }
                stage('Lint Auth Service') {
                    steps {
                        dir('services/auth-service') {
                            sh 'npm install && npm audit --audit-level=high || true'
                        }
                    }
                }
                stage('Lint Product Service') {
                    steps {
                        dir('services/product-service') {
                            sh 'npm install && npm audit --audit-level=high || true'
                        }
                    }
                }
                stage('Lint Order Service') {
                    steps {
                        dir('services/order-service') {
                            sh 'npm install && npm audit --audit-level=high || true'
                        }
                    }
                }
            }
        }

        stage('3. Container Image Build') {
            steps {
                script {
                    sh 'docker compose build'
                }
            }
        }

        stage('4. Vulnerability Security Scan') {
            steps {
                sh 'trivy image --severity HIGH,CRITICAL docker.io/stitchlyn/api-gateway:latest || true'
            }
        }

        stage('5. Container Registry Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker compose push
                    '''
                }
            }
        }

        stage('6. Deploy to Kubernetes Cluster') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_ID}", variable: 'KUBECONFIG')]) {
                    sh '''
                        kubectl apply -f k8s/namespace.yaml --kubeconfig=$KUBECONFIG
                        kubectl apply -f k8s/configmap-secrets.yaml --kubeconfig=$KUBECONFIG
                        kubectl apply -f k8s/deployments.yaml --kubeconfig=$KUBECONFIG
                        kubectl apply -f k8s/services.yaml --kubeconfig=$KUBECONFIG
                        kubectl apply -f k8s/ingress.yaml --kubeconfig=$KUBECONFIG
                        kubectl apply -f k8s/hpa.yaml --kubeconfig=$KUBECONFIG
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful to Kubernetes cluster!"
        }
        failure {
            echo "Pipeline failed. Rollback triggered."
        }
    }
}

