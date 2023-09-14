SHELL=/bin/bash

CURRENT_BRANCH_NAME := $(shell git branch --show-current)

publish:
	@export NPM_AUTH_TOKEN=`cat ~/.npmrc | grep registry.npmjs.org | grep _authToken | awk -F= '{print $$2}'`; \
	rush publish --apply --publish --target-branch $(CURRENT_BRANCH_NAME)

publish-all:
	@export NPM_AUTH_TOKEN=`cat ~/.npmrc | grep registry.npmjs.org | grep _authToken | awk -F= '{print $$2}'`; \
	rush publish --apply --publish --target-branch $(CURRENT_BRANCH_NAME) --include-all

publish-dev:
	@export NPM_AUTH_TOKEN=`cat ~/.npmrc | grep registry.npmjs.org | grep _authToken | awk -F= '{print $$2}'`; \
	rush publish --publish --include-all --tag dev
