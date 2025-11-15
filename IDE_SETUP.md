# IDE Setup for Frontend

This frontend repository uses shared IDE and Claude/Cursor configurations from the project root.

## 📁 Shared Configuration

The following are symlinked from the project root (not duplicated):

- `.vscode/` → Points to `../../.vscode/`
- `.cursor/` → Points to `../../.cursor/`

This ensures both backend and frontend use the same IDE configuration.

## 🔗 Symlink Verification

Verify symlinks are working:

```bash
ls -la .vscode   # Should show: .vscode -> ../../.vscode
ls -la .cursor   # Should show: .cursor -> ../../.cursor
```

## 📚 Documentation

For detailed setup and configuration, see:

- **Project Overview**: [README.md](../README.md) at project root
- **VSCode Configuration**: [.vscode/README.md](../.vscode/README.md)
- **Claude/Cursor Configuration**: [.cursor/README.md](../.cursor/README.md)

## 🚀 Quick Start

1. Open project in VSCode: `code .`
2. Recommended extensions will be suggested
3. Press `F5` to start Angular development server
4. Run tasks with `Cmd/Ctrl + Shift + B`

## 🔗 Related

- Frontend Repository: This repository
- Backend Repository: `../backend_redads/`
- Project Root: `../`

For more information, see the main README at the project root.
