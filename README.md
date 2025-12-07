# NEXTEditor - AI-Powered JavaScript Code Editor

A modern, browser-based JavaScript code editor with AI-powered auto-fixing capabilities. Write, run, and automatically fix your JavaScript code with intelligent error detection and formatting.

## ✨ Features

- **🎨 Clean, Modern UI**: Dark-themed interface inspired by popular code editors
- **▶️ Live Code Execution**: Run JavaScript code directly in your browser
- **🤖 AI Auto-Fix**: Intelligent code correction using AI + Prettier formatting
- **📝 Real-time Console**: See your code output and error messages instantly
- **❓ Smart Help System**: Get instant help on JavaScript topics with AI assistance
- **⚡ Fast & Responsive**: Built with Next.js 16 and React 19
Video link:https://drive.google.com/file/d/1oR8snK1jO3HSFXaOnnP4UuM08935e4lw/view?usp=sharing
## 🚀 How to Run the Project

### Prerequisites
- Node.js 20+ installed
- npm, yarn, pnpm, or bun package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Auto-Fix Rules

The AI Auto-Fix feature uses a dual-layer approach to fix and format your code:

### Layer 1: AI-Powered Fixes
Fixes common coding mistakes and typos using AI:

**Keyword Corrections:**
- `quest` → `const`
- `cnst` → `const`
- `fucntion` / `functio` / `fn` → `function`
- `consol` → `console`
- `retrun` / `retun` → `return`
- `iff` → `if`
- `esle` → `else`
- `wihle` → `while`
- `forr` → `for`

**Syntax Fixes:**
- Fixes missing parentheses in `console.log` statements
- Balances unmatched parentheses
- Corrects indentation and code structure
- Auto-closes unclosed brackets

### Layer 2: Prettier Formatting
After AI fixes, the code is formatted using Prettier for:
- Consistent indentation
- Proper spacing
- Semicolon placement
- Quote consistency
- Line length optimization

## 💡 Help System Keywords

The built-in Help Assistant responds to these keywords (and more via AI):

### Quick Topics
- **`loop`** - Learn about for loops and while loops
- **`function`** - Function declarations and arrow functions
- **`variable`** - Understanding const, let, and var
- **`console`** - How to use console.log
- **`array`** - Working with arrays
- **`error`** - Debugging tips and common error fixes

### AI-Powered Help
For any other topic, the help system uses AI to generate contextual explanations with code examples.

## 📁 Project Structure

```
next/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── api/generate/      # API endpoints for AI
│   ├── components/
│   │   ├── CodeEditor.tsx     # Code editor component
│   │   ├── ConsolePanel.tsx   # Console output display
│   │   └── HelpPanel.tsx      # Help assistant sidebar
│   └── utils/
│       ├── aiService.ts       # AI integration service
│       ├── autoFixer.ts       # AI-powered code fixer
│       ├── autoFixerStandard.ts # Prettier formatter
│       ├── codeRunner.ts      # Code execution engine
│       └── helpSystem.ts      # Help system logic
├── public/                    # Static assets
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **Language**: TypeScript 5
- **Formatting**: Prettier
- **Linting**: ESLint

## 📝 Usage Examples

### Writing Code
```javascript
// Type your JavaScript code in the editor
function greet(name) {
  console.log("Hello, " + name);
}

greet("World");
```

### Running Code
Click the green **"▶ Run Code"** button to execute your code and see output in the console.

### Auto-Fixing Code
If you have errors or messy code:
```javascript
// Before Auto-Fix
quest x = 5
console.log "x is", x
```

Click **"✨ Auto Fix"** and it becomes:
```javascript
// After Auto-Fix
const x = 5;
console.log("x is", x);
```

### Getting Help
1. Click **"Need Help?"** in the top bar
2. Type a keyword like "loop" or "function"
3. Get instant explanations with code examples

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - Feel free to use this project for learning or personal projects.

## 🙏 Acknowledgments

Built with [Next.js](https://nextjs.org), styled with [Tailwind CSS](https://tailwindcss.com), and powered by AI.
