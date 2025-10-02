# Contributing to Unified File Picker

Thank you for your interest in contributing to Unified File Picker! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- npm, yarn, or pnpm
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/unified-file-picker.git
   cd unified-file-picker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run type checking**
   ```bash
   npm run type-check
   ```

## 🛠️ Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### File Structure

```
src/
├── types/           # TypeScript type definitions
├── providers/       # Provider implementations
├── ui/             # Reusable UI components
├── utils/          # Utility functions
└── index.ts        # Main export file
```

### Adding New Providers

To add a new cloud storage provider:

1. Create a new file in `src/providers/`
2. Implement the provider interface
3. Add types to `src/types/index.ts`
4. Export from `src/providers/index.ts`
5. Update the main component
6. Add tests and documentation

Example provider structure:

```typescript
// src/providers/newprovider.ts
export async function openNewProviderPicker(
  token: string,
  options: NewProviderOptions = {},
  onPick: (files: PickedFile[]) => void,
  onCancel: () => void
): Promise<void> {
  // Implementation
}
```

### Testing

- Write tests for new features
- Test with different providers
- Test error scenarios
- Ensure TypeScript compilation passes

## 📝 Pull Request Process

### Before Submitting

1. **Check existing issues** - Make sure your issue isn't already being addressed
2. **Create an issue** - For major changes, discuss the approach first
3. **Fork and branch** - Create a feature branch from `main`
4. **Write tests** - Add tests for new functionality
5. **Update docs** - Update README and code comments
6. **Test thoroughly** - Test with multiple providers

### Pull Request Guidelines

1. **Clear title** - Use a descriptive title
2. **Detailed description** - Explain what and why
3. **Link issues** - Reference related issues
4. **Screenshots** - For UI changes
5. **Breaking changes** - Clearly mark any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested with Google Drive
- [ ] Tested with Dropbox
- [ ] Tested with OneDrive
- [ ] Tested with Box
- [ ] Added new tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly marked)
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment details**
   - Node.js version
   - React version
   - Browser and version
   - Operating system

2. **Steps to reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Code example**
   - Minimal code to reproduce
   - Provider and options used

## 💡 Feature Requests

For feature requests, please:

1. **Check existing issues** - Avoid duplicates
2. **Describe the use case** - Why is this needed?
3. **Provide examples** - How would it be used?
4. **Consider alternatives** - Are there workarounds?

## 📋 Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## 🏷️ Release Process

1. **Version bump** - Update version in `package.json`
2. **Changelog** - Update CHANGELOG.md
3. **Tag release** - Create git tag
4. **Publish** - Publish to npm
5. **Announce** - Update documentation

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and ideas
- **Email** - For security issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Unified File Picker! 🎉
