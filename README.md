# AI Concepts by Ilya Sutskever

An interactive AI tutor that makes Ilya Sutskever's essential AI reading list accessible through personalized chat conversations.

## ✨ Features

- **Interactive AI Tutor**: Choose from key AI concepts from Ilya's reading list and engage in a ChatGPT-style conversational learning interface. The AI adapts explanations to your understanding level.
- **Modern Design**: A clean, minimalist interface that is responsive and works beautifully on all devices.
- **Smart Learning**: Concepts range from beginner to advanced. Switch topics anytime and access direct links to original research papers.

## 🛠️ Getting Started

1.  **Clone and install:**
    ```bash
    git clone https://github.com/rachita-ramesh/sutskever30.git
    cd sutskever30
    npm install
    ```

2.  **Set up Anthropic API:**
    Create a `.env.local` file in the root of the project and add your Anthropic API key:
    ```
    ANTHROPIC_API_KEY=your-api-key-here
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in your browser:**
    Visit [http://localhost:3000](http://localhost:3000)

## 📖 Available Concepts

The AI tutor can teach you about a curated list of concepts from Ilya Sutskever's reading list, spanning topics like:
-   **NLP**: Attention, Transformers, and Language Models.
-   **Computer Vision**: AlexNet, Residual Learning, and Dilated Convolutions.
-   **Neural Networks**: Foundational ideas, Regularization, and advanced architectures like GNNs.
-   **Generative Models**: VAEs and other methods for creative AI.
-   **Theory & Blog Posts**: Deep dives into the principles of AI and complexity.

## 🤖 How It Works

1.  **Choose a Topic**: Pick from two randomly suggested concepts or browse the full list.
2.  **Start the Conversation**: The AI will introduce the concept in an engaging way.
3.  **Ask Questions**: Dive deeper, request examples, or explore edge cases.
4.  **Switch Anytime**: Easily change topics if your curiosity leads you elsewhere.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Ilya Sutskever's essential AI reading list.
- Powered by the Anthropic Claude API.
- Built with Next.js and Tailwind CSS.

---

**Built to make AI research accessible through conversation.**
