# Project Context

## Overview

This project is a browser-based contour and line editing tool focused on preparing black-and-white coloring book style illustrations.

The application is NOT a general-purpose image editor and NOT a professional vector design tool like Illustrator.

The editor is focused on:
- contour cleanup
- line editing
- line selection
- line thickness editing
- manual contour fixing
- reusable line groups/assets
- coloring-book preparation workflows

The workflow is manual-first with lightweight smart assistance tools.

---

# Core Principles

- Keep the architecture simple and modular.
- Avoid overengineering.
- Avoid AI-agent runtime systems.
- Avoid autonomous workflows.
- Prefer deterministic tools and predictable behavior.
- Manual user control is preferred over aggressive automation.
- Build the editor foundation first before advanced features.

---

# Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Fabric.js
- Zustand

---

# Current Scope

The current goal is to build the editor foundation and UI shell.

The first versions should support:
- image upload
- canvas rendering
- editable overlay system
- line selection
- brush selection
- line drawing
- line erasing
- line thickness editing
- reusable saved selections/assets
- export to PNG/JPG

Do NOT implement advanced AI features yet.

---

# Non Goals

The project should NOT currently include:
- AI autonomous agents
- multi-agent systems
- planning agents
- long-term memory systems
- automatic semantic object understanding
- full automatic vectorization pipelines
- auto-closing regions
- collaborative editing
- cloud sync
- backend-heavy architecture

---

# Editing Model

The editor works with:
- a raster background image
- editable overlay paths and strokes above the image

The system is NOT required to fully convert images into semantic vector scenes.

Selections can be:
- smart line selections
- manual brush/mask selections

Users manually control most editing operations.

---

# UI Layout

The application layout contains:
- top header
- left sidebar with tools
- center canvas/editor area
- right dynamic tool settings panel
- bottom expandable drawer panel

The right panel changes depending on the active tool.

The bottom drawer contains additional contextual controls depending on the active tool.

---

# Tool Philosophy

Tools should remain isolated and modular.

Examples:
- select tool
- brush selection tool
- draw tool
- erase tool
- thickness tool

Avoid tightly coupling tool logic together.

---

# Architecture Guidelines

Prefer modular folder structure.

Suggested high-level structure:

src/
  app/
  layout/
  editor/
  canvas/
  tools/
  panels/
  state/
  shared/

Keep editor logic separated from UI components whenever possible.

---

# State Management

Use Zustand for editor state.

Avoid deeply nested prop drilling.

---

# Rendering

Fabric.js is the primary canvas/rendering engine.

Avoid unnecessary abstraction layers early in development.

---

# Performance

Target image sizes:
- 1024x1024
- 2048x2048

Avoid unnecessary rerenders and oversized global state updates.

---

# Development Workflow

Development is iterative and task-based.

Implement features incrementally:
1. editor shell
2. canvas integration
3. basic tools
4. selection systems
5. editing systems
6. asset saving/loading
7. advanced tooling later

Avoid implementing future systems prematurely.