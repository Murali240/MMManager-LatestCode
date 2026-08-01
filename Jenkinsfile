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
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
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

HEADLESS=false
DEBUG=false
'''
            }
        }

        stage('Run Regression Suite') {
            steps {
                bat 'npx playwright test --grep "@regression"'
            }
        }

        stage('Generate HTML Report') {
            steps {
                bat 'npx playwright show-report'
            }
        }
    }

    post {

        always {

            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true

            archiveArtifacts artifacts: 'test-results/**', fingerprint: true

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