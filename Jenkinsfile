#!groovy

node {

           checkout scm

           stage('Checkout'){
                checkout scm
                sh 'git checkout golang'
                sh 'git pull'
            }

            stage('Build UI') {
                docker.image('node').inside {
                    withEnv([
                            /* Override the npm cache directory to avoid: EACCES: permission denied, mkdir '/.npm' */
                            'npm_config_cache=npm-cache',
                        ]) {
                                sh 'make build-statics'
                        }

                }
            }

            stage('Build Server') {
                // Install the desired Go version
                def root = tool name: 'go-1.8.1', type: 'go'

                // Export environment variables pointing to the directory where Go was installed
                docker.image('golang:onbuild').inside {
                     sh 'echo $GOROOT'
                     sh 'make build-server'
                }
            }


}

