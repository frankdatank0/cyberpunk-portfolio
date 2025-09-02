import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const WEBSITE_URL = "https://frankdatank0.github.io/";

  const asciiArt = `
             Hello from Fran! Make sure to type "open website" too!
`;

  const [history, setHistory] = useState([asciiArt, "> Please enter your username:"]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("terminal-username");
    if (storedUser) {
      setUsername(storedUser);
      setHistory([asciiArt, `> Welcome back, ${storedUser}. Type 'help' to get started.`]);
    }
  }, []);

  const pages = {
    "about.txt": "Hi, I'm Frank. I'm an ethical hacker passionate about cybersecurity.",
    "work.txt":
      "I specialize in pentesting, web app security, AI security research, and security architecture.",
    "contact.txt": "You can reach me at francis@forge-16.com or via LinkedIn.",
  };

  const commands = {
    help:
      "Available commands: help, ls, cat <file>, clear, whoami, setuser <name>, open github, open linkedin, open website",
    ls: "files: about.txt  work.txt  contact.txt",
    "cat about.txt": pages["about.txt"],
    "cat work.txt": pages["work.txt"],
    "cat contact.txt": pages["contact.txt"],
    "open github": "Redirecting to: https://github.com/frankdatank0",
    "open linkedin": "Redirecting to: https://linkedin.com/in/franciskim-cybersecurity",
    "open website": `Redirecting to: ${WEBSITE_URL}`,
  };

  const promptLine = () => (username ? `${username}@portfolio $` : "$");

  const handleCommand = (cmd) => {
    if (!username) {
      setUsername(cmd);
      localStorage.setItem("terminal-username", cmd);
      setHistory((prev) => [
        ...prev,
        `$ ${cmd}`,
        `> Welcome, ${cmd}! Type 'help' to get started.`,
      ]);
      return;
    }

    if (cmd === "clear") {
      setHistory([asciiArt]);
      return;
    }

    if (cmd === "whoami") {
      setHistory((prev) => [...prev, `${promptLine()} ${cmd}`, username]);
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
      return;
    }

    if (cmd.startsWith("setuser ")) {
      const newUser = cmd.split(" ").slice(1).join(" ").trim() || "guest";
      setUsername(newUser);
      localStorage.setItem("terminal-username", newUser);
      setHistory((prev) => [...prev, `${promptLine()} ${cmd}`, `Username changed to ${newUser}`]);
      return;
    }

    const response = commands[cmd] || `command not found: ${cmd}`;
    setHistory((prev) => [...prev, `${promptLine()} ${cmd}`, response]);

    if (cmd.startsWith("open ")) {
      const url = response.replace("Redirecting to: ", "").trim();
      if (url.startsWith("http")) window.open(url, "_blank");
    }

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      handleCommand(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="max-w-3xl mx-auto whitespace-pre-wrap">
        {history.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={i === 0 ? "ascii" : undefined}
          >
            {line}
          </motion.div>
        ))}
        <form onSubmit={handleSubmit} className="flex">
          <span className="mr-2">{promptLine()}</span>
          <div className="flex-1 flex">
            <input
              type="text"
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );
}

