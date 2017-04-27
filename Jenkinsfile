#!groovy

node {
       dir('src/github.com/reportportal') {

           stage('Checkout'){
                checkout scm
                sh 'git checkout golang-docker'
                sh 'git pull'
            }



            stage('Build Server') {
                // Export environment variables pointing to the directory where Go was installed
                docker.image('golang:1.8.1').inside("-e GOPATH=${env.WORKSPACE} -e PATH=${env.WORKSPACE}/bin")  {
                     sh 'pwd'
                     sh 'make build-server'
                }
            }
        }
}

