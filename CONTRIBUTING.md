# OrbitUI Contributing Guide

Thank you for your interest in contributing to OrbitUI! We welcome all kinds of contributions, including bug reports, feature requests, documentation improvements, and code contributions.

## 🔧 Project Structure

- `apps/docs/` — Documentation site (Astro and Starlight)
- `packages/components/` — UI components (Astro)
- `packages/cli/` — CLI tools

## 🚀 Getting Started

### How to contribute?

- You can [fork](https://github.com/nsmichelj/orbitui/fork) the repository and send [pull requests](https://github.com/nsmichelj/orbitui/pulls) with your changes.
- You can also open an [issue](https://github.com/nsmichelj/orbitui/issues) in the repository, labeling it as `enhancement` to discuss your ideas, or `bug` if you find any errors or unexpected behavior.
- Prefer to discuss your ideas before making a change? Join our [GitHub Discussions](https://github.com/nsmichelj/orbitui/discussions) to share suggestions, ask for help, or collaborate with other community members.

### Development

#### 1. [fork](https://github.com/nsmichelj/orbitui/fork) and clone it locally

```bash
git clone <YOUR_FORK>
cd orbitui
```

#### 2. nstall dependencies (requires [pnpm](https://pnpm.io/))

```bash
pnpm install
```

#### 3. Add the original repository as a remote

```bash
git remote add upstream <ORIGINAL_REPOSITORY>
```

#### 4. Create a new branch

```bash
git switch -c feature/your-improvement
```

- Follow the existing code style and conventions.
- Run `pnpm format:check` and/or `pnpm format:fix` before submitting.
- Add or update tests if applicable.

### Run a workspace

This project uses PNPM Workspaces to manage modular packages. You can run commands in specific workspaces with: `pnpm --filter=<workspace> <command>`. Additionally, the root `package.json` contains several useful development scripts. You can run these scripts directly using `pnpm <script-name>`. For a full list of available scripts, refer to the `scripts` section of the root `package.json` file.

#### Usage Examples

**Full project rebuild:**

```bash
pnpm build
# Builds all workspaces using TurboRepo
```

**Interactive development:**

```bash
pnpm dev
# Starts dev servers for all workspaces with hot-reloading
```

**Code quality checks:**

```bash
pnpm format:check
# Verify code formatting across all packages
```

**Automatic fixes:**

```bash
pnpm format:fix
# Auto-format code in all workspaces
```

### Available Workspaces

- `orbitkit` (CLI): Command-line tool.
- `@orbitkit/components`: Reusable components.
- `docs`: Project documentation.

### CLI Development

To test the command-line interface during development:

```bash
# Link CLI globally (for testing)
pnpm cli:link

# Start CLI in watch mode
pnpm cli:dev

# Unlink CLI after testing
pnpm cli:unlink
```

### Documentation Development

To work on the documentation site:

```bash
# Start documentation in dev mode
pnpm docs:dev
```

The documentation is built primarily with `MDX` using [Starlight](https://starlight.astro.build/).

### Component Development

When contributing new components, follow these steps:

1. **Create Component**

   - **Structure**: Follow `packages/components/src/astro/[component_name]/` convention.
   - **Styling**: Use the project's design system/style guidelines

2. **Register Component**

   - Add your component to `packages/components/src/registry.json`

3. **Update Documentation**
   - Create `MDX` file in `apps/docs/src/content/docs/components`
   - Include:
     - Installation
     - Usage
     - Props

## ✍️ Commit Messages

Use clear, descriptive commit messages. [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) are preferred.

## ✉️ Pull Requests

- Ensure your branch is up to date with `main`.
- Provide a clear description of your changes.
- Reference related issues if applicable.
- Be responsive to feedback during review.

## 📖 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community welcoming and respectful.

## 📣 Community

- [GitHub Discussions](https://github.com/nsmichelj/orbitui/discussions)
- [OrbitUI Documentation](https://orbitui-docs.vercel.app/)

Thank you for helping make OrbitUI better!
