.PHONY: all dist package test clean deploy

VERSION ?= $(VERSION:)
BUILD_NUMBER ?= $(BUILD_NUMBER:)

ifeq ($(TRAVIS_BUILD_NUMBER),)
	BUILD_NUMBER := dev
else
	BUILD_NUMBER := $(TRAVIS_BUILD_NUMBER)
endif

ifeq ($(TRAVIS_TAG),)
	VERSION := dev
else
	VERSION := $(TRAVIS_TAG)
endif

DIST_ROOT=dist

all: dist

clean:
	@rm -rf $(DIST_ROOT)

dist: | build package

test:
	@echo ESLint...
	@npm test

build:
	@mkdir -p $(DIST_ROOT)
	@echo Building ZBox Now! API Client
	@npm run build
	@mv $(DIST_ROOT)/bundle.min.js $(DIST_ROOT)/nowjs-client-$(VERSION).min.js
	@mv $(DIST_ROOT)/bundle.min.js.map $(DIST_ROOT)/nowjs-client-$(VERSION).min.js.map

package:
	@echo Packaging ZBox Now! API Client
	@tar -C $(DIST_ROOT) -czf nowjs-client-$(VERSION).tar.gz .
	@mv nowjs-client-$(VERSION).tar.gz $(DIST_ROOT)

deploy:
	@echo Deploying to Bower
	@bower login -t $(BOWER_TOKEN)
	@bower register nowjs-client git@github.com:ZBoxApp/nowjs-client.git
