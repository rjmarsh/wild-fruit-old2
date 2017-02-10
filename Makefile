# Makefile for status.adobe.com

DEFAULT_SHA=${shell git rev-parse HEAD}
DEFAULT_TAG=dev-docker-build:$(DEFAULT_SHA)
SERVICE_NAME=adobe-status
IMAGE_TAG=stat-img
BUILDER_TAG?=$(or $(sha),$(SERVICE_NAME)-builder)

.PHONY: asr-build docker-build run-dev ci pre-deploy-build build post-deploy-build

docker-build: sha=$(DEFAULT_SHA)
docker-build: defaultRegistry=$(DEFAULT_TAG)
docker-build: asr-build

run-dev: docker-build
	docker run -p 8888:8888 -e ENVIRONMENT_NAME=dev -e REGION_NAME=local $(DEFAULT_TAG)

asr-build:
	docker build -t $(sha) -f Dockerfile.build .
	docker run $(sha) tar -c dist Dockerfile | docker build --tag $(defaultRegistry) -

ci: build
		docker run --rm $(IMAGE_TAG) bash -c 'node --version'
		docker --version
		echo "success"

pre-deploy-build:
		echo "nothing is defined in pre-deploy-build"

build:
		docker build -t $(BUILDER_TAG) -f Dockerfile.build .
		docker run $(BUILDER_TAG) tar -c dist Dockerfile | docker build --tag $(IMAGE_TAG) -

post-deploy-build:
		echo "nothing is defined in post-deploy-build"