NODE = node
TEST = ./node_modules/.bin/vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/passport-local-forms/*.js
	dox \
		--title Passport-Local-Forms \
		--desc "Local username and password authentication strategy for Passport via forms" \
		$(shell find lib/passport-local-forms/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
