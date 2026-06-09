pipeline {

    agent any

    stages {

        stage('Fetch Secrets') {

            steps {

                sh 'npx -y @infisical/cli export --env="dev" --path="/front" --token="st.0546d9f6-f087-42a4-9a6d-36d2de474adc.bac7729093eabb48d31935ea12c342ee.6d45381246e6f9b6011a15dfc7902a68" > .env'
            }
        }

        stage('Install Dependencies') {

            steps {

                sh 'npm install'
            }
        }

        stage('Docker Build') {

            steps {

                sh 'docker compose build'
            }
        }

        stage('Docker Up') {

            steps {

                sh 'docker compose up -d --force-recreate'
            }
        }

        stage('Docker PS') {

            steps {

                sh 'node -v'
                sh 'npm -v'
            }
        }
    }

    post {

        success {

            echo 'Pipeline executada com sucesso!'
        }

        failure {

            echo 'Erro na pipeline!'
        }
    }
}
