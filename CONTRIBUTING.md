# Contributing to Moving Service Platform

First off, thank you for considering contributing to the Moving Service Platform! It's people like you that make this platform better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Write clear commit messages**
4. **Include tests** if applicable
5. **Update documentation** as needed
6. **Ensure all tests pass**
7. **Submit your pull request**

## Development Process

### Setting Up Your Development Environment

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/moving-service.git
cd moving-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
# Configure your .env.local file
```

4. Set up the database (see README.md for detailed instructions)

5. Start the development server:
```bash
npm run dev
```

### Coding Standards

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Use Prettier for code formatting
- **Linting**: Follow ESLint rules
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **Naming**: Use descriptive variable and function names

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Examples:
```
feat: Add email notification service
fix: Resolve payment calculation error
docs: Update API documentation
style: Format code according to style guide
refactor: Restructure authentication flow
test: Add tests for quote service
chore: Update dependencies
```

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test your changes in different browsers
- Test mobile responsiveness

### Documentation

- Update the README.md if needed
- Document new features
- Update API documentation
- Add JSDoc comments for functions

## Project Structure

```
moving-service/
├── app/                # Next.js app directory
├── components/         # React components
├── lib/               # Utility functions and services
├── types/             # TypeScript type definitions
├── public/            # Static assets
└── supabase/          # Database schemas
```

## Review Process

1. A maintainer will review your pull request
2. They may request changes or ask questions
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

## Community

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs and request features
- **Pull Requests**: Submit your contributions

## Recognition

Contributors will be recognized in:
- The project's README
- Release notes
- Special thanks section

Thank you for contributing! 🎉 