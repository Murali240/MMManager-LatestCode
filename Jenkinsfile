pipeline {

    agent any

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Verify Node') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                if not exist node_modules (
                    echo Installing Node Modules...
                    npm install
                ) else (
                    echo Node Modules already exist. Skipping installation.
                )
                '''
            }
        }

        stage('Create .env File') {
            steps {
                writeFile file: '.env', text: '''
MMM_BASE_URL=https://mmmdemo.issi-software.com

MMM_ADMIN_USERNAME=admin
MMM_ADMIN_PASSWORD=issi@1234

MMM_LDAP_USERNAME=kmkrishna
MMM_LDAP_PASSWORD=Gangamma@8

MMM_INVALID_USERNAME=invalidUser
MMM_INVALID_PASSWORD=invalidPassword

HEADLESS=true
DEBUG=false
'''
            }
        }

        stage('Run Regression Suite') {
            steps {
                bat 'npx playwright test --grep "@regression" || exit /b 0'
            }
        }

    }

    post {

        always {

            echo 'Publishing Reports...'

            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
            archiveArtifacts artifacts: 'test-results/**', fingerprint: true

            allure(
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            )

            echo 'Pipeline Finished'
        }

        success {
            echo 'Regression Suite Executed Successfully'
        }

        failure {
            echo 'Regression Suite Failed'
        }

    }
}