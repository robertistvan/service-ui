#!groovy

node {

           checkout scm

           stage('Checkout'){
                checkout scm
                sh 'git checkout golang-docker'
                sh 'git pull'
            }



            stage('Build Server') {
                // Export environment variables pointing to the directory where Go was installed
                docker.image('golang:1.8.1').inside("-u root" +
                        " -v ${env.WORKSPACE}:/usr/src/github.com/reportportal " +
                        "-w /usr/src/github.com/reportportal " + "
                        "-e $GOPATH":/usr") {
                     sh 'echo $GOPATH'
                     sh 'echo $GOROOT'
                     sh 'ls -la'
                     sh 'bash -c "make build-server"'
                }
            }

}

