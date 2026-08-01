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

        }

        success {
            echo 'Regression Suite Executed Successfully'
        }

        failure {
            echo 'Regression Suite Failed'
        }
    }
}