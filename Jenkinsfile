#!groovy

node {

           stage('Checkout'){
                checkout scm
                sh 'git checkout golang-docker'
                sh 'git pull'
            }



            stage('Build Server') {
                // Export environment variables pointing to the directory where Go was installed
                docker.image('golang:1.8.1').inside {
                     sh 'echo $GOPATH'
                     sh 'echo $GOROOT'
                     sh 'ls -la'
                     sh 'make build-server'
                }
            }

}

