# Start the development server
dev:
	npm run dev

# Build the project for production
build:
	npm run build

# Start the production server
start:
	npm start

# Run tests
test:
	npm test

# Clean up build artifacts
clean:
	rm -rf .next
	rm -rf out

# Deploy the project (example using Vercel CLI)
deploy:
	vercel --prod

# Install dependencies
install:
	npm install

# Format code using Prettier
format:
	npx prettier --write .

# Lint the project
lint:
	npm run lint
