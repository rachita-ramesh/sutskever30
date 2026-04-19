# AI Concepts by Ilya Sutskever

An interactive way to work through Ilya Sutskever's essential AI reading list — not as a blog post, but as a browsable constellation of papers with short playable lessons and a Socratic AI tutor alongside.

## ✨ Features

- **Concept constellation.** Every paper is a node on a map, clustered by theme (Sequence, Attention, Vision, Theory, Memory & Reasoning, Systems). Node size encodes difficulty; edges are prereqs.
- **Six-stage lessons.** Each paper opens an interactive lesson: **Hook → Intuition → Playground → Socratic → Assemble → Mastery**. The Transformer lesson is fully built out with custom playgrounds (multi-head attention, Q/K/V intuition, softmax-temperature sweeps); other papers use a shared stage template.
- **Socratic tutor panel.** An always-available AI tutor on the side. It watches the stage you're on and asks questions instead of dumping answers.
- **Jump to the source.** Every concept links to its original paper, blog, or course page.
- **Tweakable.** Theme, density, AI tone, and difficulty can be changed on the fly.

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

## 📖 What's on the map

Papers are grouped into six clusters:

-   **Sequence** — Unreasonable RNNs, Understanding LSTM, RNN Regularization, Order Matters
-   **Attention** — Bahdanau Attention, Pointer Networks, Attention Is All You Need, The Annotated Transformer
-   **Vision** — AlexNet, Deep Residual, Identity Mappings, Dilated Convolutions, CS231n
-   **Theory** — Keeping NNs Simple, MDL Tutorial, Kolmogorov Complexity, Scaling Laws, Complexodynamics, Coffee Automaton, Machine Super Intelligence
-   **Memory & Reasoning** — Neural Turing Machines, Variational Lossy AE, Relational Reasoning, Relational RNNs, Neural Message Passing
-   **Systems** — GPipe, Deep Speech 2

## 🤖 How it works

1.  **Browse the map.** Pick any node on the constellation. Hover for a card with the paper's author, year, and a link to the original source.
2.  **Work the stages.** A six-stage lesson guides you from a motivating hook to a visual intuition to a hands-on playground to Socratic questions to an "assemble the block" puzzle to a mastery MCQ.
3.  **Argue with the tutor.** The side panel is a Socratic tutor, not an explainer. It asks questions back. Click the quick-reply chips or type your own.
4.  **Go to the source.** Every lesson has a "Paper ↗" button that opens the real paper in a new tab.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Ilya Sutskever's essential AI reading list.
- Powered by the Anthropic Claude API.
- Built with Next.js and Tailwind CSS.

---

**Built to make AI research feel like play, not reading.**
