install:
	npm install
publish:
	npm publish
lint:
	npm run eslint src/** src/bin/** 
run:
		npm run babel-node -- 'src/bin/gendiff.js' -h
test:
	npm test
