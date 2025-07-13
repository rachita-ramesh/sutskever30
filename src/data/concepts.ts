import { Concept } from "@/types/chat";

export const concepts: Concept[] = [
  {
    id: "attention-is-all-you-need",
    name: "Attention Is All You Need",
    description: "Introduced the Transformer, a novel network architecture based solely on attention mechanisms.",
    category: "NLP",
    difficulty: "advanced",
    paperReference: {
      title: "Attention Is All You Need",
      authors: ["Vaswani", "Shazeer", "Parmar", "Uszkoreit", "Jones", "Gomez", "Kaiser", "Polosukhin"],
      year: 2017,
      url: "https://arxiv.org/abs/1706.03762"
    }
  },
  {
    id: "unreasonable-effectiveness-rnn",
    name: "The Unreasonable Effectiveness of RNNs",
    description: "An exploration of how Recurrent Neural Networks excel at sequence modeling.",
    category: "Sequence Models",
    difficulty: "beginner",
    paperReference: {
      title: "The Unreasonable Effectiveness of Recurrent Neural Networks",
      authors: ["Andrej Karpathy"],
      year: 2015,
      url: "https://karpathy.github.io/2015/05/21/rnn-effectiveness/"
    }
  },
  {
    id: "understanding-lstm",
    name: "Understanding LSTM Networks",
    description: "A visual and intuitive explanation of Long Short-Term Memory (LSTM) networks.",
    category: "Sequence Models",
    difficulty: "beginner",
    paperReference: {
      title: "Understanding LSTM Networks",
      authors: ["Christopher Olah"],
      year: 2015,
      url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/"
    }
  },
  {
    id: "rnn-regularization",
    name: "Recurrent Neural Network Regularization",
    description: "A method for applying dropout to LSTMs to reduce overfitting.",
    category: "Neural Networks",
    difficulty: "intermediate",
    paperReference: {
      title: "Recurrent Neural Network Regularization",
      authors: ["Zaremba", "Sutskever", "Vinyals"],
      year: 2014,
      url: "https://arxiv.org/abs/1409.2329"
    }
  },
  {
    id: "mdl-for-nn",
    name: "Keeping Neural Networks Simple",
    description: "A method to keep neural networks simple by minimizing the description length of the weights.",
    category: "Regularization",
    difficulty: "advanced",
    paperReference: {
      title: "Keeping Neural Networks Simple by Minimizing the Description Length of the Weights",
      authors: ["Hinton", "van Camp"],
      year: 1993,
      url: "http://www.cs.toronto.edu/~hinton/absps/colt93.pdf"
    }
  },
  {
    id: "alexnet",
    name: "AlexNet",
    description: "The deep CNN that kickstarted the computer vision revolution.",
    category: "Computer Vision",
    difficulty: "intermediate",
    paperReference: {
      title: "ImageNet Classification with Deep Convolutional Neural Networks",
      authors: ["Krizhevsky", "Sutskever", "Hinton"],
      year: 2012,
      url: "https://papers.nips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf"
    }
  },
  {
    id: "residual-learning",
    name: "Deep Residual Learning",
    description: "Introducing residual connections (ResNets) to train very deep neural networks.",
    category: "Computer Vision",
    difficulty: "intermediate",
    paperReference: {
      title: "Deep Residual Learning for Image Recognition",
      authors: ["He", "Zhang", "Ren", "Sun"],
      year: 2015,
      url: "https://arxiv.org/abs/1512.03385"
    }
  },
  {
    id: "pointer-networks",
    name: "Pointer Networks",
    description: "A neural architecture that uses attention as a pointer to select members of an input sequence.",
    category: "Neural Networks",
    difficulty: "advanced",
    paperReference: {
      title: "Pointer Networks",
      authors: ["Vinyals", "Fortunato", "Jaitly"],
      year: 2015,
      url: "https://arxiv.org/abs/1506.03134"
    }
  },
  {
    id: "bahdanau-attention",
    name: "Bahdanau Attention",
    description: "Introduced an attention mechanism that allows a model to jointly learn to align and translate.",
    category: "NLP",
    difficulty: "advanced",
    paperReference: {
      title: "Neural Machine Translation by Jointly Learning to Align and Translate",
      authors: ["Bahdanau", "Cho", "Bengio"],
      year: 2014,
      url: "https://arxiv.org/abs/1409.0473"
    }
  },
  {
    id: "annotated-transformer",
    name: "The Annotated Transformer",
    description: "A line-by-line implementation of the 'Attention Is All You Need' paper.",
    category: "Blog Post",
    difficulty: "intermediate",
    paperReference: {
      title: "The Annotated Transformer",
      authors: ["Alexander Rush"],
      year: 2018,
      url: "https://nlp.seas.harvard.edu/2018/04/03/attention.html"
    }
  },
  {
    id: "complexodynamics",
    name: "The First Law of Complexodynamics",
    description: "A blog post exploring why the complexity of physical systems seems to increase, peak, and then decrease over time.",
    category: "Blog Post",
    difficulty: "advanced",
    paperReference: {
      title: "The First Law of Complexodynamics",
      authors: ["Scott Aaronson"],
      year: 2011,
      url: "https://scottaaronson.blog/?p=762"
    }
  },
  {
    id: "coffee-automaton",
    name: "The Coffee Automaton",
    description: "An attempt to quantify the rise and fall of complexity in closed systems using a cellular automaton model.",
    category: "Theory",
    difficulty: "advanced",
    paperReference: {
      title: "Quantifying the Rise and Fall of Complexity in Closed Systems: The Coffee Automaton",
      authors: ["Aaronson", "Carroll", "Ouellette"],
      year: 2014,
      url: "https://arxiv.org/abs/1405.6903"
    }
  },
  {
    id: "order-matters",
    name: "Order Matters: Sequence to Sequence for Sets",
    description: "Extends the seq2seq framework to handle sets as inputs and outputs.",
    category: "Sequence Models",
    difficulty: "advanced",
    paperReference: {
      title: "Order Matters: Sequence to sequence for sets",
      authors: ["Vinyals", "Bengio", "Kudlur"],
      year: 2015,
      url: "https://arxiv.org/abs/1511.06391"
    }
  },
  {
    id: "gpipe",
    name: "GPipe",
    description: "A library for scaling any network that can be expressed as a sequence of layers using pipeline parallelism.",
    category: "Infrastructure",
    difficulty: "advanced",
    paperReference: {
      title: "GPipe: Easy Scaling with Micro-Batch Pipeline Parallelism",
      authors: ["Huang", "Cheng", "Bapna", "Firat", "Chen", "Chen", "Lee", "Ngiam", "Le", "Wu", "Chen"],
      year: 2018,
      url: "https://arxiv.org/abs/1811.06965"
    }
  },
  {
    id: "dilated-convolutions",
    name: "Dilated Convolutions",
    description: "A module that uses dilated convolutions to aggregate multi-scale contextual information without losing resolution.",
    category: "Computer Vision",
    difficulty: "intermediate",
    paperReference: {
      title: "Multi-Scale Context Aggregation by Dilated Convolutions",
      authors: ["Yu", "Koltun"],
      year: 2015,
      url: "https://arxiv.org/abs/1511.07122"
    }
  },
  {
    id: "neural-message-passing",
    name: "Neural Message Passing",
    description: "A framework for supervised learning on graphs, applied to predicting quantum mechanical properties of molecules.",
    category: "Graph Neural Networks",
    difficulty: "advanced",
    paperReference: {
      title: "Neural Message Passing for Quantum Chemistry",
      authors: ["Gilmer", "Schoenholz", "Riley", "Vinyals", "Dahl"],
      year: 2017,
      url: "https://arxiv.org/abs/1704.01212"
    }
  },
  {
    id: "identity-mappings-resnet",
    name: "Identity Mappings in Deep Residual Networks",
    description: "An analysis of residual blocks that proposes a new unit to make training easier and improve generalization.",
    category: "Computer Vision",
    difficulty: "advanced",
    paperReference: {
      title: "Identity Mappings in Deep Residual Networks",
      authors: ["He", "Zhang", "Ren", "Sun"],
      year: 2016,
      url: "https://arxiv.org/abs/1603.05027"
    }
  },
  {
    id: "relational-reasoning",
    name: "Relational Reasoning",
    description: "A plug-and-play module to solve problems that hinge on relational reasoning.",
    category: "Neural Networks",
    difficulty: "advanced",
    paperReference: {
      title: "A simple neural network module for relational reasoning",
      authors: ["Santoro", "Raposo", "Barrett", "Malinowski", "Pascanu", "Battaglia", "Lillicrap"],
      year: 2017,
      url: "https://arxiv.org/abs/1706.01427"
    }
  },
  {
    id: "variational-lossy-autoencoder",
    name: "Variational Lossy Autoencoder",
    description: "A method to learn global representations by combining VAEs with neural autoregressive models.",
    category: "Generative Models",
    difficulty: "advanced",
    paperReference: {
      title: "Variational Lossy Autoencoder",
      authors: ["Chen", "Kingma", "Salimans", "Duan", "Dhariwal", "Schulman", "Sutskever", "Abbeel"],
      year: 2016,
      url: "https://arxiv.org/abs/1611.02731"
    }
  },
  {
    id: "relational-recurrent-nn",
    name: "Relational Recurrent Neural Networks",
    description: "A recurrent neural network architecture for relational reasoning.",
    category: "Neural Networks",
    difficulty: "advanced",
    paperReference: {
      title: "Relational recurrent neural networks",
      authors: ["Santoro", "Raposo", "Barrett", "Malinowski", "Pascanu", "Battaglia", "Lillicrap"],
      year: 2018,
      url: "https://arxiv.org/abs/1806.01822"
    }
  },
  {
    id: "neural-turing-machines",
    name: "Neural Turing Machines",
    description: "A neural network architecture coupled with external memory resources, analogous to a Turing Machine.",
    category: "Neural Networks",
    difficulty: "advanced",
    paperReference: {
      title: "Neural Turing Machines",
      authors: ["Graves", "Wayne", "Danihelka"],
      year: 2014,
      url: "https://arxiv.org/abs/1410.5401"
    }
  },
  {
    id: "deep-speech-2",
    name: "Deep Speech 2",
    description: "An end-to-end deep learning approach for speech recognition in both English and Mandarin.",
    category: "Speech Recognition",
    difficulty: "intermediate",
    paperReference: {
      title: "Deep Speech 2: End-to-End Speech Recognition in English and Mandarin",
      authors: ["Amodei", "Ananthanarayanan", "Anubhai", "Bai", "Battenberg", "Case", "Casper", "Catanzaro", "Cheng", "Chen", "Chen", "Chen", "Chen", "Chrzanowski", "Coates", "Diamos", "Ding", "Du", "Elsen", "Engel", "Fang", "Fan", "Fougner", "Gao", "Gong", "Hannun", "Han", "Johannes", "Jiang", "Ju", "Jun", "LeGresley", "Lin", "Liu", "Liu", "Li", "Li", "Ma", "Narang", "Ng", "Ozair", "Peng", "Prenger", "Qian", "Quan", "Raiman", "Rao", "Satheesh", "Seetapun", "Sengupta", "Srinet", "Sriram", "Tang", "Tang", "Wang", "Wang", "Wang", "Wang", "Wang", "Wang", "Wu", "Wei", "Xiao", "Xie", "Xie", "Yogatama", "Yuan", "Zhan", "Zhu"],
      year: 2015,
      url: "https://arxiv.org/abs/1512.02595"
    }
  },
  {
    id: "scaling-laws-for-nlm",
    name: "Scaling Laws for Neural Language Models",
    description: "An empirical study of scaling laws for language model performance on cross-entropy loss.",
    category: "NLP",
    difficulty: "advanced",
    paperReference: {
      title: "Scaling Laws for Neural Language Models",
      authors: ["Kaplan", "McCandlish", "Henighan", "Brown", "Chess", "Child", "Gray", "Radford", "Wu", "Amodei"],
      year: 2020,
      url: "https://arxiv.org/abs/2001.08361"
    }
  },
  {
    id: "mdl-tutorial",
    name: "MDL Tutorial",
    description: "A tutorial introduction to the Minimum Description Length Principle.",
    category: "Theory",
    difficulty: "advanced",
    paperReference: {
      title: "A Tutorial Introduction to the Minimum Description Length Principle",
      authors: ["Peter Grünwald"],
      year: 2004,
      url: "https://arxiv.org/abs/math/0406077"
    }
  },
  {
    id: "machine-super-intelligence",
    name: "Machine Super Intelligence",
    description: "A PhD thesis on the definition and implications of machine super intelligence.",
    category: "Theory",
    difficulty: "advanced",
    paperReference: {
      title: "Machine Super Intelligence",
      authors: ["Shane Legg"],
      year: 2008,
      url: "https://www.vetta.org/documents/Machine_Super_Intelligence.pdf"
    }
  },
  {
    id: "kolmogorov-complexity",
    name: "Kolmogorov Complexity",
    description: "An exposition of the basic notions of complexity and randomness.",
    category: "Theory",
    difficulty: "advanced",
    paperReference: {
      title: "Kolmogorov Complexity and Algorithmic Randomness",
      authors: ["Shen", "Uspensky", "Vereshchagin"],
      year: 2017,
      url: "https://www.ams.org/books/surv/220/"
    }
  },
  {
    id: "cs231n",
    name: "CS231n",
    description: "A comprehensive course on convolutional neural networks for visual recognition.",
    category: "Course",
    difficulty: "beginner",
    paperReference: {
      title: "CS231n: Convolutional Neural Networks for Visual Recognition",
      authors: ["Fei-Fei Li", "Andrej Karpathy", "Justin Johnson"],
      year: 2015,
      url: "http://cs231n.stanford.edu/"
    }
  }
];

export function getRandomConcepts(count: number = 2): Concept[] {
  const shuffled = [...concepts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getConceptById(id: string): Concept | undefined {
  return concepts.find(concept => concept.id === id);
} 