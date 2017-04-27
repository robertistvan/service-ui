#!groovy

node {

           checkout scm

           stage('Checkout'){
                checkout scm
                sh 'git checkout golang-docker'
                sh 'git pull'
            }

            stage('Build UI') {
                docker.image('node:onbuild').inside('-u root') {
                       sh 'make build-statics'
                }
            }

            stage('Build Server') {
                // Export environment variables pointing to the directory where Go was installed
                docker.image('golang:1.8.1').inside {
                     sh 'echo $GOROOT'
                     sh 'make build-server'
                }
            }


}

