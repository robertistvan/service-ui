#!groovy

node {

           stage('Checkout'){
                checkout scm
                sh 'git checkout golang-docker'
                sh 'git pull'
            }



            stage('Build Server') {
                            // Export environment variables pointing to the directory where Go was installed
                              docker.image('golang:1.8.1').inside("-u root -e GOPATH=${env.WORKSPACE}")  {
                                 sh 'PATH=$PATH:$GOPATH/bin && make build-server'
                            }
             }
}

