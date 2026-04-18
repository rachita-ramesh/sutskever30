// ============= LESSON LIBRARY =============
// One entry per concept. Each provides the CONTENT for the 6 stages.
// Shared stage components (lesson-stages-lib.jsx) render from these.

// Schema per lesson:
// {
//   id, title, subtitle, duration,
//   hook: { headline, subhead, before, after, tokens, highlight:[i,i] }
//   intuition: { title, intro, cards:[{letter,title,sub,color}], metaphor:{leftLabel,rightLabel,items:[{from,to}]} }
//   playground: { kind:"weights"|"slider"|"tokens", ...params }
//   socratic: [ {q, hint, expected} ... ]
//   assemble: { slots:[{id,label,want}], pool:[{id,label,color,decoy?,multi?}] }
//   mastery: [ {prompt, options:[{t,ok,why}]} ]
// }

const LESSON_LIB = {
  // ============ SEQUENCE ============
  "rnn-eff": {
    id:"rnn-eff", title:"The Unreasonable Effectiveness of RNNs", subtitle:"Karpathy, 2015 · blog",
    duration:"~12 min",
    hook:{ headline:"Character by character,", subhead2:"Shakespeare appears.",
      subtext:"A tiny RNN, trained on raw text, learns punctuation, line breaks, even pseudo-Shakespeare — from nothing but next-character prediction.",
      tokens:"t h e   a n i m a l".split(" "), highlight:[4], beforeLabel:"One char", afterLabel:"Hidden state carries everything",
      beforeSub:"h ← h, then predict next",
      afterSub:"memory in a vector"
    },
    intuition:{ title:"One vector holds the past.", intro:"An RNN reads tokens one at a time, folding each into a hidden state vector h. Everything it knows about what it's read lives in that h.",
      cards:[
        { letter:"x", title:"Input", sub:"the new token", color:"var(--amber)"},
        { letter:"h", title:"Hidden state", sub:"memory so far", color:"var(--teal)"},
        { letter:"y", title:"Output", sub:"next-token guess", color:"var(--iris)"},
      ]},
    playground:{ kind:"tokens-stream", sentence:"to be or not to be that is the question".split(" "),
      caption:"Each step updates h. Click a step to see what's in memory." },
    socratic:[
      { q:"Why can a character-level RNN still learn words and grammar?", hint:"What does h compress across many steps?",
        expected:"Next-char prediction forces h to encode statistical regularities — common bigrams, word boundaries, syntax — because they help predict the next character." },
      { q:"What fails when sequences get very long?", hint:"Think gradients flowing backward through time.",
        expected:"Gradients vanish or explode as they chain through many steps; distant tokens can't influence learning. LSTMs address this with a gated cell state." },
    ],
    assemble:{ slots:[
      { id:"s1", label:"Input x_t", want:"input" },
      { id:"s2", label:"Combine with h_{t-1}", want:"combine" },
      { id:"s3", label:"Nonlinearity", want:"nonlin" },
      { id:"s4", label:"Emit y_t", want:"emit" },
    ], pool:[
      { id:"input", label:"x_t embedding", color:"var(--amber)"},
      { id:"combine", label:"W·x + U·h", color:"var(--teal)"},
      { id:"nonlin", label:"tanh(...)", color:"var(--iris)"},
      { id:"emit", label:"softmax → y_t", color:"var(--sky)"},
      { id:"conv", label:"2D convolution", color:"var(--rose)", decoy:true},
    ]},
    mastery:[
      { prompt:"What does the hidden state h_t represent?", options:[
        { t:"A summary of everything seen so far", ok:true, why:"Right — h compresses past context into a fixed vector."},
        { t:"Only the last input token", ok:false, why:"That'd be a Markov-1 model, not an RNN."},
        { t:"The model's output", ok:false, why:"Output is derived from h, not equal to it."},
      ]},
      { prompt:"Why does character-level prediction still capture grammar?", options:[
        { t:"Characters secretly know grammar", ok:false, why:"Characters are dumb; the network learns structure."},
        { t:"Minimizing next-char loss forces the network to internalize word & syntax patterns", ok:true, why:"Predictive pressure → representation of structure."},
        { t:"Because of attention", ok:false, why:"No attention here — vanilla RNN."},
      ]},
    ]
  },

  "lstm": {
    id:"lstm", title:"Understanding LSTM Networks", subtitle:"Olah, 2015 · blog", duration:"~14 min",
    hook:{ headline:"The problem was forgetting.", subhead2:"Gates are the fix.",
      subtext:"RNNs bleed information. LSTM adds a cell state C — a highway through time — and three gates that decide what to forget, what to add, and what to output.",
      tokens:"input → [forget] [input] [output] → cell".split(" "), highlight:[2,3,4],
      beforeLabel:"RNN", beforeSub:"one state, forgets fast",
      afterLabel:"LSTM", afterSub:"cell state + gates"
    },
    intuition:{ title:"Three gates, one highway.", intro:"The cell state C flows straight through with minimal interference. Gates are sigmoid valves that multiply: 0 closes, 1 opens.",
      cards:[
        { letter:"f", title:"Forget gate", sub:"what to drop from C", color:"var(--rose)"},
        { letter:"i", title:"Input gate", sub:"what to add to C", color:"var(--teal)"},
        { letter:"o", title:"Output gate", sub:"what to reveal as h", color:"var(--iris)"},
      ]},
    playground:{ kind:"gates", caption:"Slide each gate between 0 (closed) and 1 (open). Watch the cell state." },
    socratic:[
      { q:"Why an additive update on C, not multiplicative?", hint:"Think gradient through 100 timesteps.",
        expected:"Adding avoids the vanishing-gradient catastrophe of repeated matrix multiplications; gradients flow back through C almost unchanged." },
      { q:"If all gates ≡ 1, what does LSTM reduce to?", hint:"Look at what f=1, i=1, o=1 does.",
        expected:"f=1 retains all C, i=1 fully integrates new info, o=1 reveals all C. It becomes a pass-through accumulator — still much more stable than an RNN." },
    ],
    assemble:{ slots:[
      { id:"s1", label:"Compute gates from [h,x]", want:"gatecalc" },
      { id:"s2", label:"Forget old C", want:"forget" },
      { id:"s3", label:"Add new candidate", want:"add" },
      { id:"s4", label:"Emit filtered h", want:"out" },
    ], pool:[
      { id:"gatecalc", label:"σ(W·[h,x]) for f,i,o", color:"var(--amber)"},
      { id:"forget", label:"C := f ⊙ C", color:"var(--rose)"},
      { id:"add", label:"C := C + i ⊙ C̃", color:"var(--teal)"},
      { id:"out", label:"h := o ⊙ tanh(C)", color:"var(--iris)"},
      { id:"attn", label:"Multi-head attention", color:"var(--sky)", decoy:true},
    ]},
    mastery:[
      { prompt:"What is the cell state C?", options:[
        { t:"A second hidden state that changes minimally per step", ok:true, why:"Correct — that's the gradient highway."},
        { t:"The output layer", ok:false, why:"Output is derived from C, not equal to it."},
        { t:"The gradient", ok:false, why:"It carries information, not gradient."},
      ]},
      { prompt:"What fixes vanishing gradients?", options:[
        { t:"ReLU activations", ok:false, why:"LSTM uses tanh/sigmoid; ReLU isn't why it works."},
        { t:"Additive updates to C through gates", ok:true, why:"Yes — gradient flows through + almost unimpeded."},
        { t:"Dropout", ok:false, why:"Dropout regularizes, doesn't solve vanishing."},
      ]},
    ]
  },

  "rnn-reg": makeLesson({
    id:"rnn-reg", title:"Recurrent Neural Network Regularization", authors:"Zaremba et al., 2014",
    hookHead:"Dropout inside time", hookSub:"ruins memory.",
    hookText:"Naively applying dropout at every timestep destroys the hidden state's signal. The fix: only drop on non-recurrent connections.",
    intuitionTitle:"Drop between layers, not through time.",
    intuitionIntro:"Between stacked layers is fine. Through the recurrence is fatal — it severs the memory.",
    cards:[{letter:"↑",title:"Vertical",sub:"safe to drop",color:"var(--teal)"},
           {letter:"→",title:"Horizontal",sub:"keep clean",color:"var(--rose)"}],
    playgroundKind:"slider",
    socratic:[
      {q:"Why is horizontal dropout catastrophic?", hint:"What does each recurrent step rely on?",
       expected:"Every step builds on h_{t-1}. Zeroing it randomly turns memory into noise; long-range patterns disintegrate."}
    ],
    assembleSlots:[
      {id:"s1",label:"Input embedding",want:"emb"},
      {id:"s2",label:"Dropout (vertical)",want:"drop"},
      {id:"s3",label:"LSTM layer",want:"lstm"},
      {id:"s4",label:"Dropout (vertical)",want:"drop"},
      {id:"s5",label:"Output softmax",want:"soft"},
    ],
    assemblePool:[
      {id:"emb",label:"Token embedding",color:"var(--amber)"},
      {id:"drop",label:"Dropout p=0.5",color:"var(--teal)",multi:true},
      {id:"lstm",label:"LSTM cell",color:"var(--iris)"},
      {id:"soft",label:"Softmax",color:"var(--sky)"},
      {id:"rhdrop",label:"Recurrent-step dropout",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Where does the paper say dropout should go?",
        right:"Only on non-recurrent connections (between layers)",
        rightWhy:"Yes — that leaves the hidden state untouched.",
        wrongs:[["Everywhere, including h_{t-1} → h_t","That destroys memory."],
                ["Only at the output","Misses the point — you lose regularization on internal layers."]]},
    ]
  }),

  "order": makeLesson({
    id:"order", title:"Order Matters: Sequence to Sequence for Sets", authors:"Vinyals et al., 2015",
    hookHead:"Sets have no order.", hookSub:"But models do.",
    hookText:"Feed the same set in different orders, an RNN will encode it differently. The paper proposes an order-invariant encoder via content-based attention over elements.",
    intuitionTitle:"Permutation invariance, earned.",
    intuitionIntro:"Instead of reading elements in sequence, use iterative attention: let a 'read' vector pool over the set until convergence.",
    cards:[{letter:"R",title:"Read",sub:"pooling vector",color:"var(--amber)"},
           {letter:"A",title:"Attend",sub:"over set",color:"var(--iris)"},
           {letter:"S",title:"Stable",sub:"order-free",color:"var(--teal)"}],
    playgroundKind:"weights",
    socratic:[
      {q:"Why does permutation matter for encoder-decoder with sets?", hint:"What bakes order into an RNN encoder?",
       expected:"RNNs fold state in sequence; two permutations of the same set produce different final states, hence different outputs. Bad for set-valued inputs."}
    ],
    assembleSlots:[
      {id:"s1",label:"Element embeddings",want:"emb"},
      {id:"s2",label:"Iterative attention pool",want:"attn"},
      {id:"s3",label:"Pointer decoder",want:"ptr"},
    ],
    assemblePool:[
      {id:"emb",label:"Element embedding",color:"var(--amber)"},
      {id:"attn",label:"Content-based attention pooling",color:"var(--iris)"},
      {id:"ptr",label:"Pointer decoder",color:"var(--teal)"},
      {id:"seq",label:"Sequential LSTM encoder",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What property does the proposed encoder achieve?",
        right:"Permutation invariance over the input set",
        rightWhy:"Right — the output doesn't depend on input order.",
        wrongs:[["Translation equivariance","That's a CNN property."],
                ["Time invariance","Unrelated."]]}
    ]
  }),

  // ============ ATTENTION (transformer handled by legacy, others below) ============
  "bahdanau": makeLesson({
    id:"bahdanau", title:"Neural Machine Translation by Jointly Learning to Align and Translate",
    authors:"Bahdanau, Cho, Bengio · 2014",
    hookHead:"Translation needed", hookSub:"a spotlight.",
    hookText:"Before attention, seq2seq crammed an entire sentence into one vector. Bahdanau let the decoder look back at the source — a soft alignment over encoder states.",
    intuitionTitle:"The decoder peeks.",
    intuitionIntro:"At every output step, compute alignment scores over source words, softmax them, and take a weighted sum of encoder states. That's the context vector c_t.",
    cards:[{letter:"h",title:"Encoder states",sub:"one per source word",color:"var(--teal)"},
           {letter:"s",title:"Decoder state",sub:"asks the question",color:"var(--amber)"},
           {letter:"c",title:"Context",sub:"weighted h's",color:"var(--iris)"}],
    playgroundKind:"weights-align",
    socratic:[
      {q:"Why did one-vector seq2seq struggle on long sentences?", hint:"Information bottleneck.",
       expected:"A fixed-size vector can't losslessly carry arbitrarily long sentences; performance degrades with length. Attention adds content-addressable memory."},
    ],
    assembleSlots:[
      {id:"s1",label:"Encoder (bi-RNN) states",want:"enc"},
      {id:"s2",label:"Alignment score e_{t,i}",want:"score"},
      {id:"s3",label:"Softmax over i",want:"soft"},
      {id:"s4",label:"Context c_t = Σ α·h",want:"ctx"},
      {id:"s5",label:"Decoder step",want:"dec"},
    ],
    assemblePool:[
      {id:"enc",label:"Bi-directional RNN",color:"var(--teal)"},
      {id:"score",label:"MLP(s, h_i) → score",color:"var(--amber)"},
      {id:"soft",label:"softmax(scores)",color:"var(--iris)"},
      {id:"ctx",label:"Weighted sum of h's",color:"var(--sky)"},
      {id:"dec",label:"RNN decoder with c_t",color:"var(--rose)"},
      {id:"conv",label:"Strided convolution",color:"var(--lime)",decoy:true},
    ],
    mcq:[
      {q:"What does Bahdanau attention output at each decoder step?",
        right:"A context vector: weighted sum of encoder states",
        rightWhy:"Exactly — it's a soft lookup.",
        wrongs:[["The hidden state of the encoder's last word","That's the vanilla seq2seq bottleneck."],
                ["A one-hot source word","It's soft, not one-hot."]]}
    ]
  }),

  "pointer": makeLesson({
    id:"pointer", title:"Pointer Networks", authors:"Vinyals et al., 2015",
    hookHead:"Output a position,", hookSub:"not a token.",
    hookText:"Sometimes the answer is 'word 4 of the input'. Pointer networks use attention weights *as* the output distribution — pointing back into the input.",
    intuitionTitle:"Attention → output.",
    intuitionIntro:"Instead of feeding the context vector to a classifier, interpret the attention distribution itself as a choice among input positions.",
    cards:[{letter:"→",title:"Point",sub:"pick an index",color:"var(--iris)"},
           {letter:"α",title:"Attention",sub:"is the policy",color:"var(--amber)"}],
    playgroundKind:"weights",
    socratic:[
      {q:"Why can't a fixed-vocab softmax solve Travelling Salesman?", hint:"What changes with input size?",
       expected:"The answer vocabulary is the input itself, whose size varies. You can't pre-allocate an output head. Pointing sidesteps this."},
    ],
    assembleSlots:[
      {id:"s1",label:"Encoder over input points",want:"enc"},
      {id:"s2",label:"Attention scores",want:"attn"},
      {id:"s3",label:"Softmax = output",want:"out"},
    ],
    assemblePool:[
      {id:"enc",label:"RNN encoder",color:"var(--teal)"},
      {id:"attn",label:"Attention over inputs",color:"var(--amber)"},
      {id:"out",label:"Softmax as pointer",color:"var(--iris)"},
      {id:"proj",label:"Vocabulary projection",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What makes pointer networks handle variable-size outputs?",
        right:"Output space = input positions, so it grows with input",
        rightWhy:"Yes — variable inputs, variable outputs.",
        wrongs:[["Bigger vocabulary","Doesn't help if vocab must match input."],
                ["Beam search","Decoding strategy, not the key idea."]]}
    ]
  }),

  "annotated": makeLesson({
    id:"annotated", title:"The Annotated Transformer", authors:"Sasha Rush · 2018",
    hookHead:"Every equation,", hookSub:"every line of code.",
    hookText:"A literate-programming walkthrough: read a paragraph of the paper, then the exact PyTorch that implements it. No magic.",
    intuitionTitle:"Paper ↔ Code.",
    intuitionIntro:"The Transformer's complexity melts when you pair the math with tiny, isolated code modules. Each module ≤ 10 lines.",
    cards:[{letter:"≡",title:"Read",sub:"paper paragraph",color:"var(--iris)"},
           {letter:"{}",title:"Code",sub:"exact implementation",color:"var(--teal)"}],
    playgroundKind:"code-toggle",
    socratic:[
      {q:"Why is multi-head attention just a reshape + matmul?", hint:"Where does the 'multi' happen?",
       expected:"Reshape (d_model) → (h, d_k), run scaled dot-product in parallel across the head dimension, then reshape back. No loop, no duplication."}
    ],
    assembleSlots:[
      {id:"s1",label:"Embed + PosEnc",want:"emb"},
      {id:"s2",label:"MultiHeadAttention",want:"mha"},
      {id:"s3",label:"LayerNorm + Residual",want:"norm"},
      {id:"s4",label:"Position-wise FFN",want:"ffn"},
    ],
    assemblePool:[
      {id:"emb",label:"Embedding + sinusoid PosEnc",color:"var(--amber)"},
      {id:"mha",label:"MultiHeadAttention",color:"var(--iris)"},
      {id:"norm",label:"LayerNorm + residual",color:"var(--teal)",multi:true},
      {id:"ffn",label:"Linear → ReLU → Linear",color:"var(--sky)"},
      {id:"rnn",label:"LSTM cell",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Main pedagogical claim of the Annotated Transformer?",
        right:"Pair each paper section with minimal runnable code",
        rightWhy:"Exactly — literate programming.",
        wrongs:[["Re-derive attention from scratch","It implements, doesn't rederive."],
                ["Train a new SOTA model","No — the point is clarity."]]}
    ]
  }),

  "scaling": makeLesson({
    id:"scaling", title:"Scaling Laws for Neural Language Models", authors:"Kaplan et al., 2020",
    hookHead:"Loss falls like a power law", hookSub:"in compute, data, params.",
    hookText:"Train bigger for longer on more data, and loss decreases predictably along a straight line in log-log space. For a long time, that was the whole recipe.",
    intuitionTitle:"A straight line on log-log.",
    intuitionIntro:"L(N) ≈ (Nc / N)^α. Double parameters → loss drops by a fixed fraction. Same for data, same for compute.",
    cards:[{letter:"N",title:"Params",sub:"model size",color:"var(--amber)"},
           {letter:"D",title:"Dataset",sub:"token count",color:"var(--teal)"},
           {letter:"C",title:"Compute",sub:"FLOPs",color:"var(--iris)"}],
    playgroundKind:"powerlaw",
    socratic:[
      {q:"If compute is fixed, should you go big-and-short or small-and-long?", hint:"Which factor bottlenecks loss?",
       expected:"Kaplan suggested bigger models undertrained. Chinchilla later showed this was wrong at practical budgets — balance N and D. Context matters."},
    ],
    assembleSlots:[
      {id:"s1",label:"Fix two, vary one",want:"vary"},
      {id:"s2",label:"Plot log L vs log x",want:"plot"},
      {id:"s3",label:"Fit power law",want:"fit"},
    ],
    assemblePool:[
      {id:"vary",label:"Sweep a single variable",color:"var(--amber)"},
      {id:"plot",label:"Log-log plot",color:"var(--teal)"},
      {id:"fit",label:"Linear fit → exponent α",color:"var(--iris)"},
      {id:"grid",label:"Grid search hyperparams",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What shape do test-loss curves take?",
        right:"Power law: straight line in log-log",
        rightWhy:"Yes — hallmark of the paper.",
        wrongs:[["Exponential decay","Loss falls more slowly than that."],
                ["Step function","No — smooth."]]}
    ]
  }),

  // ============ VISION ============
  "alexnet": {
    id:"alexnet", title:"ImageNet Classification with Deep CNNs", subtitle:"Krizhevsky, Sutskever, Hinton · 2012",
    duration:"~14 min",
    hook:{ headline:"The night", subhead2:"deep learning won.",
      subtext:"AlexNet cut ImageNet top-5 error from 26% to 15% overnight. GPU training, ReLU, dropout, data augmentation — all in one paper.",
      tokens:"224 × 224 × 3 → 1000 classes".split(" "), highlight:[4],
      beforeLabel:"2011 SOTA", beforeSub:"hand-crafted features · 26% err",
      afterLabel:"AlexNet", afterSub:"learned features · 15% err"
    },
    intuition:{ title:"Four ideas, one paper.", intro:"Each on its own was known. Together, on two GPUs, they ignited deep learning.",
      cards:[
        { letter:"R", title:"ReLU", sub:"fast, sparse", color:"var(--amber)"},
        { letter:"D", title:"Dropout", sub:"implicit ensemble", color:"var(--teal)"},
        { letter:"G", title:"GPUs", sub:"two of them, in parallel", color:"var(--iris)"},
        { letter:"A", title:"Augment", sub:"crop, flip, jitter", color:"var(--rose)"},
      ]},
    playground:{ kind:"filters", caption:"Drag to see what conv filters learn: edges, textures, parts, objects." },
    socratic:[
      {q:"Why did ReLU matter so much?", hint:"Think about gradients through sigmoid for deep networks.",
       expected:"Sigmoid saturates and kills gradients; ReLU passes through for positive inputs, enabling deeper networks to train end-to-end."},
      {q:"Why augment the training data?", hint:"What is overfitting in terms of invariances?",
       expected:"60M parameters on 1.2M images invites overfitting. Augmentations teach translation, scale, and color invariance cheaply."}
    ],
    assemble:{ slots:[
      {id:"s1",label:"Conv 11×11",want:"c1"},
      {id:"s2",label:"MaxPool",want:"pool"},
      {id:"s3",label:"Conv 5×5",want:"c2"},
      {id:"s4",label:"More conv",want:"c3"},
      {id:"s5",label:"FC + Dropout",want:"fc"},
      {id:"s6",label:"Softmax 1000",want:"soft"},
    ], pool:[
      {id:"c1",label:"Conv 11×11, stride 4",color:"var(--amber)"},
      {id:"pool",label:"MaxPool 3×3",color:"var(--teal)"},
      {id:"c2",label:"Conv 5×5",color:"var(--iris)"},
      {id:"c3",label:"Conv 3×3 ×3",color:"var(--sky)"},
      {id:"fc",label:"Fully connected + dropout",color:"var(--rose)"},
      {id:"soft",label:"Softmax 1000",color:"var(--lime)"},
      {id:"attn",label:"Multi-head attention",color:"var(--ink-dim)",decoy:true},
    ]},
    mastery:[
      {prompt:"What error rate did AlexNet achieve on ImageNet top-5?", options:[
        {t:"≈15%",ok:true,why:"Down from ~26% the year before."},
        {t:"≈3%",ok:false,why:"That's much later (ResNet + successors)."},
        {t:"≈40%",ok:false,why:"That's pre-CNN era."},
      ]},
      {prompt:"Which ingredient specifically combats overfitting?", options:[
        {t:"ReLU",ok:false,why:"ReLU helps optimization, not directly regularization."},
        {t:"Dropout",ok:true,why:"Dropout randomly zeroes units — an implicit ensemble."},
        {t:"GPUs",ok:false,why:"GPUs enable training; they don't regularize."},
      ]},
    ]
  },

  "resnet": makeLesson({
    id:"resnet", title:"Deep Residual Learning for Image Recognition", authors:"He et al., 2015",
    hookHead:"Going deeper should help.", hookSub:"It stopped helping.",
    hookText:"Past ~20 layers, plain nets got worse on training set — not a generalization problem. Residual connections fixed it by reframing the problem.",
    intuitionTitle:"Learn the residual, not the whole map.",
    intuitionIntro:"y = F(x) + x. If F(x)=0 does the job, you get identity for free. The net only has to learn the delta.",
    cards:[{letter:"+",title:"Skip",sub:"add x back",color:"var(--teal)"},
           {letter:"F",title:"Residual",sub:"learn the delta",color:"var(--iris)"},
           {letter:"I",title:"Identity",sub:"always reachable",color:"var(--amber)"}],
    playgroundKind:"depth",
    socratic:[
      {q:"Why does plain-net training error *increase* past some depth?", hint:"Not overfitting — training error.",
       expected:"Optimization difficulty: SGD can't find the identity mapping via dozens of stacked nonlinearities. Residuals make identity the default."},
      {q:"Why does y = F(x) + x help gradient flow?", hint:"Backprop through the + node.",
       expected:"Gradient splits: ∂L/∂x = ∂L/∂y · (F'(x) + 1). The +1 keeps gradient alive even when F's derivative is tiny."}
    ],
    assembleSlots:[
      {id:"s1",label:"Input x",want:"in"},
      {id:"s2",label:"Conv-BN-ReLU-Conv-BN",want:"block"},
      {id:"s3",label:"Skip connection +",want:"skip"},
      {id:"s4",label:"ReLU",want:"relu"},
    ],
    assemblePool:[
      {id:"in",label:"Input activation",color:"var(--amber)"},
      {id:"block",label:"Conv→BN→ReLU→Conv→BN",color:"var(--iris)"},
      {id:"skip",label:"+ (residual add)",color:"var(--teal)"},
      {id:"relu",label:"ReLU",color:"var(--sky)"},
      {id:"drop",label:"Dropout",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What happens when training a very deep plain network?",
        right:"Training accuracy degrades — optimization failure",
        rightWhy:"Right — not a generalization issue.",
        wrongs:[["It overfits badly","Training error isn't the overfit signal."],
                ["It always improves","The paper refutes this directly."]]}
    ]
  }),

  "identity": makeLesson({
    id:"identity", title:"Identity Mappings in Deep Residual Networks", authors:"He et al., 2016",
    hookHead:"Where the + goes", hookSub:"matters a lot.",
    hookText:"Pre-activation ResNet: move BN and ReLU *before* the conv, keep the skip path pure identity. 1001 layers now train cleanly.",
    intuitionTitle:"Keep the highway clean.",
    intuitionIntro:"The residual path shouldn't have any nonlinearity on it. Every nonlinearity lives inside the residual branch.",
    cards:[{letter:"↕",title:"Pre-act",sub:"BN→ReLU→Conv",color:"var(--teal)"},
           {letter:"=",title:"Identity",sub:"pure skip",color:"var(--amber)"}],
    playgroundKind:"depth",
    socratic:[
      {q:"Why must the skip path be identity?", hint:"What enables gradient flow across 1000 layers?",
       expected:"An unobstructed additive path means gradients propagate multiplied by ~1, not decayed through dozens of BN+ReLU+conv stages."}
    ],
    assembleSlots:[
      {id:"s1",label:"BN",want:"bn"},
      {id:"s2",label:"ReLU",want:"relu"},
      {id:"s3",label:"Conv",want:"conv"},
      {id:"s4",label:"+ (skip add)",want:"add"},
    ],
    assemblePool:[
      {id:"bn",label:"BatchNorm",color:"var(--teal)"},
      {id:"relu",label:"ReLU",color:"var(--amber)"},
      {id:"conv",label:"Conv 3×3",color:"var(--iris)"},
      {id:"add",label:"Residual add",color:"var(--sky)"},
      {id:"soft",label:"Softmax",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Why is pre-activation better than post-activation?",
        right:"It keeps the skip path as pure identity",
        rightWhy:"Yes — gradients flow unimpeded.",
        wrongs:[["It uses fewer parameters","Same parameters."],
                ["It removes batch norm","No — it moves BN, not removes it."]]}
    ]
  }),

  "dilated": makeLesson({
    id:"dilated", title:"Multi-Scale Context Aggregation by Dilated Convolutions", authors:"Yu & Koltun, 2015",
    hookHead:"See wider without", hookSub:"losing resolution.",
    hookText:"Pooling loses pixels. Dilation inflates the receptive field exponentially by spacing out the kernel — same params, wider view, full resolution.",
    intuitionTitle:"Space the taps.",
    intuitionIntro:"Rate=1 → standard 3×3. Rate=2 → skip a pixel between taps. Stacking rate=1,2,4,8 grows receptive field exponentially.",
    cards:[{letter:"1",title:"Rate 1",sub:"dense",color:"var(--teal)"},
           {letter:"2",title:"Rate 2",sub:"skip one",color:"var(--iris)"},
           {letter:"4",title:"Rate 4",sub:"skip three",color:"var(--amber)"}],
    playgroundKind:"dilation",
    socratic:[
      {q:"Why not just stack more 3×3 convs to widen the RF?", hint:"Count parameters and layers.",
       expected:"Linear growth — each layer adds only 2 pixels. Dilation doubles per layer: exponential RF growth with no extra params, no pooling losses."},
    ],
    assembleSlots:[
      {id:"s1",label:"Dilated conv rate=1",want:"d1"},
      {id:"s2",label:"Dilated conv rate=2",want:"d2"},
      {id:"s3",label:"Dilated conv rate=4",want:"d4"},
      {id:"s4",label:"Dilated conv rate=8",want:"d8"},
    ],
    assemblePool:[
      {id:"d1",label:"Conv 3×3, r=1",color:"var(--teal)"},
      {id:"d2",label:"Conv 3×3, r=2",color:"var(--iris)"},
      {id:"d4",label:"Conv 3×3, r=4",color:"var(--amber)"},
      {id:"d8",label:"Conv 3×3, r=8",color:"var(--rose)"},
      {id:"pool",label:"MaxPool",color:"var(--sky)",decoy:true},
    ],
    mcq:[
      {q:"What does dilation buy you?",
        right:"Exponentially growing receptive field at same resolution",
        rightWhy:"Right — no pooling needed.",
        wrongs:[["Parameter reduction","Param count is identical."],
                ["Translation invariance","All convs have that."]]}
    ]
  }),

  "cs231n": makeLesson({
    id:"cs231n", title:"CS231n Convolutional Neural Networks", authors:"Stanford · Karpathy & others",
    hookHead:"A course,", hookSub:"not a paper.",
    hookText:"The canonical beginner's path into deep learning for vision: backprop from scratch, CNN internals, modern architectures, optimization.",
    intuitionTitle:"Build it once, by hand.",
    intuitionIntro:"The assignment notes walk you through a two-layer net, then a CNN, in numpy. Backprop is a forall-loop, not magic.",
    cards:[{letter:"∂",title:"Backprop",sub:"chain rule in code",color:"var(--amber)"},
           {letter:"C",title:"CNN",sub:"from scratch",color:"var(--iris)"}],
    playgroundKind:"slider",
    socratic:[
      {q:"Why derive backprop by hand once?", hint:"Once framework-free, always framework-free.",
       expected:"Autograd is a tool, not a concept. Hand-derivation builds intuition for shapes, gradient flow, and debugging — transfers to any framework."}
    ],
    assembleSlots:[
      {id:"s1",label:"Forward pass",want:"fwd"},
      {id:"s2",label:"Loss",want:"loss"},
      {id:"s3",label:"Backward pass",want:"bwd"},
      {id:"s4",label:"SGD update",want:"sgd"},
    ],
    assemblePool:[
      {id:"fwd",label:"Compute activations",color:"var(--teal)"},
      {id:"loss",label:"Cross-entropy loss",color:"var(--amber)"},
      {id:"bwd",label:"Chain-rule gradients",color:"var(--iris)"},
      {id:"sgd",label:"W := W − η·∇W",color:"var(--sky)"},
      {id:"attn",label:"Cross-attention",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What is the course's pedagogical thesis?",
        right:"Understand by implementing from scratch first",
        rightWhy:"Yes — derive, then abstract.",
        wrongs:[["Memorize architectures","No."],["Use pretrained only","No — build from scratch."]]}
    ]
  }),

  // ============ THEORY ============
  "mdl-simple": makeLesson({
    id:"mdl-simple", title:"Keeping Neural Networks Simple by Minimizing Description Length", authors:"Hinton & van Camp, 1993",
    hookHead:"The best model", hookSub:"is the shortest one that works.",
    hookText:"Minimum Description Length: generalize = compress. Training loss + model complexity (in bits) is what you should minimize.",
    intuitionTitle:"Bits of data, bits of weights.",
    intuitionIntro:"Transmit the data to a receiver by sending (a) the model, then (b) the residual errors. Minimize total bits.",
    cards:[{letter:"D",title:"Data bits",sub:"errors given model",color:"var(--teal)"},
           {letter:"M",title:"Model bits",sub:"describe the weights",color:"var(--amber)"}],
    playgroundKind:"complexity",
    socratic:[
      {q:"Why does MDL argue against massive over-parameterization?", hint:"At a naive encoding.",
       expected:"Naively, more weights = more bits to describe. But clever priors (e.g. noisy weights) can make 'effective' model bits small — motivating Bayesian NNs."}
    ],
    assembleSlots:[
      {id:"s1",label:"Fit model to data",want:"fit"},
      {id:"s2",label:"Encode residuals",want:"res"},
      {id:"s3",label:"Encode weights (prior)",want:"prior"},
      {id:"s4",label:"Sum bits → L(θ)",want:"sum"},
    ],
    assemblePool:[
      {id:"fit",label:"ML fit of weights",color:"var(--iris)"},
      {id:"res",label:"Code data | model",color:"var(--teal)"},
      {id:"prior",label:"Code model under prior",color:"var(--amber)"},
      {id:"sum",label:"Total description length",color:"var(--sky)"},
      {id:"ens",label:"Ensemble averaging",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What is the MDL principle?",
        right:"Minimize bits = data residuals + model description",
        rightWhy:"Yes — total description length.",
        wrongs:[["Minimize parameters count","Not directly."],
                ["Maximize likelihood only","That ignores complexity."]]}
    ]
  }),

  "mdl-tut": makeLesson({
    id:"mdl-tut", title:"A Tutorial Introduction to the Minimum Description Length Principle", authors:"Grünwald, 2004",
    hookHead:"Learning = compression.", hookSub:"Rigorously.",
    hookText:"A careful grounding: Kolmogorov complexity, two-part codes, Bayesian-MDL equivalence, model selection by code length.",
    intuitionTitle:"Codes and models, duality.",
    intuitionIntro:"Every probability model corresponds to a code. The best model is the one whose code compresses the data best.",
    cards:[{letter:"p",title:"Model",sub:"distribution",color:"var(--teal)"},
           {letter:"L",title:"Code length",sub:"−log p(x)",color:"var(--amber)"}],
    playgroundKind:"slider",
    socratic:[
      {q:"If two models have similar fit, which wins under MDL?", hint:"Think complexity.",
       expected:"The one with smaller description length for its parameters — i.e. the simpler model. That's Occam's razor made quantitative."}
    ],
    assembleSlots:[
      {id:"s1",label:"Choose code for θ",want:"codep"},
      {id:"s2",label:"Choose code for data|θ",want:"codex"},
      {id:"s3",label:"Pick θ minimizing sum",want:"pick"},
    ],
    assemblePool:[
      {id:"codep",label:"Prior code for θ",color:"var(--amber)"},
      {id:"codex",label:"Model code for x|θ",color:"var(--teal)"},
      {id:"pick",label:"Minimize total length",color:"var(--iris)"},
      {id:"reg",label:"L2 regularization only",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"MDL relates model selection to:",
        right:"Data compression",
        rightWhy:"Yes — shortest description wins.",
        wrongs:[["Cross-validation","Related but not the definition."],
                ["Ensembling","Different paradigm."]]}
    ]
  }),

  "kolmo": makeLesson({
    id:"kolmo", title:"Kolmogorov Complexity and Algorithmic Randomness", authors:"Shen, Uspensky, Vereshchagin · 2017",
    hookHead:"The shortest program", hookSub:"that prints x.",
    hookText:"K(x) = length of the shortest program that outputs x. Uncomputable, but the conceptual backbone of 'simplicity' and compression-based learning.",
    intuitionTitle:"Incompressible = random.",
    intuitionIntro:"A string is algorithmically random if its shortest program is as long as the string itself. Patterns are compressibility.",
    cards:[{letter:"K",title:"Complexity",sub:"shortest program",color:"var(--amber)"},
           {letter:"R",title:"Random",sub:"K(x) ≈ |x|",color:"var(--rose)"},
           {letter:"S",title:"Simple",sub:"K(x) ≪ |x|",color:"var(--teal)"}],
    playgroundKind:"compress",
    socratic:[
      {q:"Why is K(x) uncomputable?", hint:"Halting problem.",
       expected:"Determining whether a program halts is undecidable; you can't search all programs and confirm the shortest halter. We can only upper-bound K."}
    ],
    assembleSlots:[
      {id:"s1",label:"Fix a universal TM U",want:"tm"},
      {id:"s2",label:"Enumerate programs",want:"enum"},
      {id:"s3",label:"Shortest p with U(p)=x",want:"short"},
    ],
    assemblePool:[
      {id:"tm",label:"Universal Turing machine",color:"var(--teal)"},
      {id:"enum",label:"List programs by length",color:"var(--amber)"},
      {id:"short",label:"Pick shortest printing x",color:"var(--iris)"},
      {id:"stat",label:"Estimate with statistics",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Can K(x) be computed exactly?",
        right:"No — it is uncomputable in general",
        rightWhy:"Right — reduces to halting.",
        wrongs:[["Yes, via exhaustive search","Search never certifies minimality."],
                ["Yes, for any TM","No machine can."]]}
    ]
  }),

  "complexo": makeLesson({
    id:"complexo", title:"Why Philosophers Should Care About Computational Complexity", authors:"Aaronson, 2011",
    hookHead:"Not all 'easy in principle'", hookSub:"is easy in practice.",
    hookText:"Computational complexity reframes classic philosophical questions: induction, learning, consciousness, knowledge — by taking feasibility seriously.",
    intuitionTitle:"Polynomial vs exponential.",
    intuitionIntro:"Computable says nothing about the real world if it takes 2^n steps. Complexity asks: what can we do before the heat death of the universe?",
    cards:[{letter:"P",title:"Polynomial",sub:"feasible",color:"var(--teal)"},
           {letter:"NP",title:"NP",sub:"verifiable",color:"var(--amber)"},
           {letter:"∞",title:"Super-exp",sub:"not in this universe",color:"var(--rose)"}],
    playgroundKind:"slider",
    socratic:[
      {q:"How does complexity bite the problem of induction?", hint:"Enumerate-all-hypotheses.",
       expected:"Solomonoff induction is uncomputable and even polynomial bounds preclude brute-force hypothesis enumeration. Learning must be heuristic by necessity."}
    ],
    assembleSlots:[
      {id:"s1",label:"Problem",want:"prob"},
      {id:"s2",label:"Best algorithm",want:"alg"},
      {id:"s3",label:"Runtime bound",want:"time"},
    ],
    assemblePool:[
      {id:"prob",label:"Formal problem",color:"var(--teal)"},
      {id:"alg",label:"Best known algorithm",color:"var(--amber)"},
      {id:"time",label:"Runtime in n",color:"var(--iris)"},
      {id:"hw",label:"Hardware cost",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Complexity theory's philosophical contribution:",
        right:"Taking computational feasibility seriously changes old questions",
        rightWhy:"Exactly Aaronson's thesis.",
        wrongs:[["Solves P vs NP","No."],["Proves consciousness","No."]]}
    ]
  }),

  "coffee": makeLesson({
    id:"coffee", title:"The Coffee Automaton — Complexity as Intermediate",
    authors:"Aaronson, Carroll, Ouellette · 2014",
    hookHead:"Pour cream in coffee.", hookSub:"Complexity rises, then falls.",
    hookText:"Entropy goes up monotonically. But 'interesting structure' peaks in the middle — when the cream is swirled but not yet uniform. That's complexity.",
    intuitionTitle:"Entropy ≠ complexity.",
    intuitionIntro:"A lattice simulation shows how the 'apparent complexity' (roughly, compressibility of the coarse-grained state) rises then falls while entropy climbs forever.",
    cards:[{letter:"S",title:"Entropy",sub:"up and up",color:"var(--rose)"},
           {letter:"C",title:"Complexity",sub:"rises then falls",color:"var(--amber)"}],
    playgroundKind:"coffee",
    socratic:[
      {q:"Why does 'interesting' structure peak mid-mixing?", hint:"Think what 'pattern' looks like at t=0 and t=∞.",
       expected:"At t=0: two blocks, trivial. At t=∞: uniform, trivial. In between: fractal tendrils — hard to describe compactly."}
    ],
    assembleSlots:[
      {id:"s1",label:"Coarse-grain state",want:"coarse"},
      {id:"s2",label:"Estimate compressibility",want:"comp"},
      {id:"s3",label:"Plot vs time",want:"plot"},
    ],
    assemblePool:[
      {id:"coarse",label:"Downsample grid",color:"var(--teal)"},
      {id:"comp",label:"Estimate K via gzip",color:"var(--amber)"},
      {id:"plot",label:"Plot C(t)",color:"var(--iris)"},
      {id:"ens",label:"Quantum ensemble",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What does apparent complexity do over time?",
        right:"Rises, peaks, falls back to zero",
        rightWhy:"That's the coffee curve.",
        wrongs:[["Monotonically rises (like entropy)","No — distinguishes from entropy."],
                ["Stays constant","No."]]}
    ]
  }),

  "msi": makeLesson({
    id:"msi", title:"Machine Super Intelligence", authors:"Shane Legg, 2008 (thesis)",
    hookHead:"What is intelligence,", hookSub:"measurably?",
    hookText:"Legg proposes a universal intelligence measure: expected reward over all computable environments, weighted by Kolmogorov prior. Beautiful, uncomputable.",
    intuitionTitle:"Agent × environment × prior.",
    intuitionIntro:"Intelligence ∝ Σ_env 2^{-K(env)} · E[reward | agent, env]. Averaged across *all* computable worlds.",
    cards:[{letter:"π",title:"Agent",sub:"policy",color:"var(--amber)"},
           {letter:"μ",title:"Environment",sub:"a world",color:"var(--teal)"},
           {letter:"w",title:"Weight",sub:"2^{-K(μ)}",color:"var(--iris)"}],
    playgroundKind:"slider",
    socratic:[
      {q:"Why weight environments by 2^{-K(μ)}?", hint:"Occam + convergence.",
       expected:"To make the sum finite *and* favor simple environments. Without it, pathological environments dominate. It's the Solomonoff prior."}
    ],
    assembleSlots:[
      {id:"s1",label:"Enumerate environments",want:"env"},
      {id:"s2",label:"Weight by Occam prior",want:"pri"},
      {id:"s3",label:"Expected reward per agent",want:"rew"},
      {id:"s4",label:"Sum → Υ(π)",want:"sum"},
    ],
    assemblePool:[
      {id:"env",label:"Computable environments",color:"var(--teal)"},
      {id:"pri",label:"2^{-K(μ)} prior",color:"var(--iris)"},
      {id:"rew",label:"E[reward]",color:"var(--amber)"},
      {id:"sum",label:"Weighted sum",color:"var(--sky)"},
      {id:"grad",label:"Policy gradient",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Υ(π) is computable?",
        right:"No — K is uncomputable, Υ inherits it",
        rightWhy:"Right — theoretical tool.",
        wrongs:[["Yes","Uncomputable."],
                ["Only for finite environments","No — sum is over all."]]}
    ]
  }),

  // ============ GENERATIVE ============
  "vlae": makeLesson({
    id:"vlae", title:"Variational Lossy Autoencoders", authors:"Chen et al., 2016",
    hookHead:"What do you want", hookSub:"to forget?",
    hookText:"Vanilla VAE tries to reconstruct everything. VLAE deliberately uses a weak decoder so the latent code carries *only* the information the decoder can't recover — the semantically interesting part.",
    intuitionTitle:"Forget the texture, keep the content.",
    intuitionIntro:"Match the decoder's receptive field to what you want it to generate on its own. The latent holds the rest.",
    cards:[{letter:"z",title:"Latent",sub:"keeps the rest",color:"var(--iris)"},
           {letter:"x̂",title:"Decoder",sub:"local detail",color:"var(--teal)"}],
    playgroundKind:"slider",
    socratic:[
      {q:"Why use a PixelCNN decoder?", hint:"What can a PixelCNN already capture without the latent?",
       expected:"PixelCNN models local pixel correlations. Pairing with VAE forces z to encode *global* structure — PixelCNN handles textures on its own."}
    ],
    assembleSlots:[
      {id:"s1",label:"Encoder q(z|x)",want:"enc"},
      {id:"s2",label:"Sample z",want:"samp"},
      {id:"s3",label:"Weak decoder p(x|z)",want:"dec"},
      {id:"s4",label:"ELBO loss",want:"elbo"},
    ],
    assemblePool:[
      {id:"enc",label:"Inference network",color:"var(--amber)"},
      {id:"samp",label:"Reparameterization",color:"var(--teal)"},
      {id:"dec",label:"PixelCNN decoder",color:"var(--iris)"},
      {id:"elbo",label:"ELBO = recon + KL",color:"var(--sky)"},
      {id:"gan",label:"GAN discriminator",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Why is the decoder deliberately weakened?",
        right:"So z only encodes what the decoder cannot",
        rightWhy:"Correct — it's about information allocation.",
        wrongs:[["To train faster","Unrelated."],
                ["To prevent GAN mode collapse","Different paradigm."]]}
    ]
  }),

  "relrea": makeLesson({
    id:"relrea", title:"A simple neural network module for relational reasoning", authors:"Santoro et al., 2017",
    hookHead:"Reasoning = pairs.", hookSub:"Compute them all.",
    hookText:"For each pair of objects (i,j), apply an MLP g_θ(o_i, o_j). Sum all pairwise outputs. That's the Relation Network — state-of-the-art on CLEVR overnight.",
    intuitionTitle:"All pairs, one MLP.",
    intuitionIntro:"Relations live between objects. A shared MLP over every (o_i, o_j) pair lets the model learn what 'near', 'left-of', 'same-color' mean, composably.",
    cards:[{letter:"o",title:"Objects",sub:"from CNN grid",color:"var(--teal)"},
           {letter:"g",title:"Pairwise MLP",sub:"shared",color:"var(--amber)"},
           {letter:"Σ",title:"Sum",sub:"pool pairs",color:"var(--iris)"}],
    playgroundKind:"pairs",
    socratic:[
      {q:"Why sum over pairs instead of using attention?", hint:"Symmetry + inductive bias.",
       expected:"Sum is permutation-invariant and forces each pair to contribute independently. Simple, effective, and biases toward relational composition."}
    ],
    assembleSlots:[
      {id:"s1",label:"Extract objects (CNN)",want:"obj"},
      {id:"s2",label:"Form all pairs",want:"pair"},
      {id:"s3",label:"Apply g_θ per pair",want:"g"},
      {id:"s4",label:"Sum pairs, feed f_φ",want:"sum"},
    ],
    assemblePool:[
      {id:"obj",label:"CNN feature map → objects",color:"var(--teal)"},
      {id:"pair",label:"All (i,j) pairs",color:"var(--amber)"},
      {id:"g",label:"Shared MLP g_θ",color:"var(--iris)"},
      {id:"sum",label:"Sum + final MLP f_φ",color:"var(--sky)"},
      {id:"lstm",label:"LSTM over objects",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What's the relation module's key operation?",
        right:"Shared MLP over every pair, summed",
        rightWhy:"Yes.",
        wrongs:[["Attention over objects","Different mechanism."],
                ["Graph convolution","Related but different."]]}
    ]
  }),

  "relrnn": makeLesson({
    id:"relrnn", title:"Relational recurrent neural networks", authors:"Santoro et al., 2018",
    hookHead:"LSTM memory slots", hookSub:"should talk to each other.",
    hookText:"Relational Memory Core: each memory slot attends to every other slot via multi-head attention, at every step. Relations across memory, over time.",
    intuitionTitle:"Memory that thinks together.",
    intuitionIntro:"Take an LSTM-like memory matrix M. Each row attends to every other row via MHA. The updated memory is now relationally coherent.",
    cards:[{letter:"M",title:"Memory matrix",sub:"rows = slots",color:"var(--teal)"},
           {letter:"A",title:"Self-attention",sub:"between slots",color:"var(--iris)"}],
    playgroundKind:"weights",
    socratic:[
      {q:"Why not just use a Transformer?", hint:"Think sequence length and time.",
       expected:"Over long sequences you want bounded memory. RMC keeps a fixed slot matrix, growing in relational depth with self-attention rather than in length."}
    ],
    assembleSlots:[
      {id:"s1",label:"Memory matrix M",want:"mem"},
      {id:"s2",label:"MHA over rows of M",want:"mha"},
      {id:"s3",label:"Gated update",want:"gate"},
    ],
    assemblePool:[
      {id:"mem",label:"Slot-based memory",color:"var(--teal)"},
      {id:"mha",label:"Multi-head attention",color:"var(--iris)"},
      {id:"gate",label:"Gated residual update",color:"var(--amber)"},
      {id:"conv",label:"1D convolution",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What's the key idea of Relational Memory Core?",
        right:"Memory slots attend to each other at every step",
        rightWhy:"Yes.",
        wrongs:[["Infinite external memory","Bounded, not infinite."],
                ["Discrete addressing","No — soft attention."]]}
    ]
  }),

  "msg": makeLesson({
    id:"msg", title:"Neural Message Passing for Quantum Chemistry", authors:"Gilmer et al., 2017",
    hookHead:"Graphs are everywhere.", hookSub:"Nodes, edges, messages.",
    hookText:"Molecules, social networks, knowledge graphs. Message-passing neural networks unify graph learning: each node aggregates messages from neighbors, repeat.",
    intuitionTitle:"Passing the note.",
    intuitionIntro:"For each node: collect neighbor features via a learned message function, aggregate them, update your own state. Repeat T times.",
    cards:[{letter:"m",title:"Message",sub:"from neighbor",color:"var(--amber)"},
           {letter:"Σ",title:"Aggregate",sub:"sum/mean/max",color:"var(--teal)"},
           {letter:"u",title:"Update",sub:"new node state",color:"var(--iris)"}],
    playgroundKind:"graph",
    socratic:[
      {q:"Why does the framework include both directed and undirected edges?", hint:"Chemistry.",
       expected:"Bonds are undirected but have types (single/double); some relations are inherently directed (e.g. hydrogen-bond donor→acceptor). MPNN generalizes."}
    ],
    assembleSlots:[
      {id:"s1",label:"Compute messages m_{v→w}",want:"msg"},
      {id:"s2",label:"Aggregate at each node",want:"agg"},
      {id:"s3",label:"Update node state",want:"upd"},
      {id:"s4",label:"Readout → graph prediction",want:"read"},
    ],
    assemblePool:[
      {id:"msg",label:"Message function M(h_v, h_w, e_{vw})",color:"var(--amber)"},
      {id:"agg",label:"Sum messages",color:"var(--teal)"},
      {id:"upd",label:"GRU update",color:"var(--iris)"},
      {id:"read",label:"Set2Set readout",color:"var(--sky)"},
      {id:"attn",label:"Causal mask",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What is the core step of MPNN?",
        right:"Aggregate messages from neighbors, update state",
        rightWhy:"Yes.",
        wrongs:[["Dot-product attention","Different framework."],
                ["Pooling to a fixed grid","No — operates on graph topology."]]}
    ]
  }),

  // ============ INFRA ============
  "ntm": makeLesson({
    id:"ntm", title:"Neural Turing Machines", authors:"Graves, Wayne, Danihelka · 2014",
    hookHead:"A neural net with", hookSub:"an external memory tape.",
    hookText:"What if the network had a differentiable read/write head into a memory bank? It could learn algorithms — copy, sort, associative recall — end-to-end.",
    intuitionTitle:"Differentiable memory.",
    intuitionIntro:"Soft attention over memory addresses, content- *and* location-based. Read = weighted sum. Write = erase + add. All differentiable.",
    cards:[{letter:"R",title:"Read head",sub:"weighted read",color:"var(--teal)"},
           {letter:"W",title:"Write head",sub:"erase + add",color:"var(--amber)"},
           {letter:"M",title:"Memory",sub:"N × M matrix",color:"var(--iris)"}],
    playgroundKind:"memory",
    socratic:[
      {q:"Why mix content-based and location-based addressing?", hint:"What can each do that the other can't?",
       expected:"Content-based retrieves by similarity (associative recall). Location-based supports iteration/shifting (copy, arithmetic). Together you get general-purpose memory ops."}
    ],
    assembleSlots:[
      {id:"s1",label:"Controller (LSTM)",want:"ctrl"},
      {id:"s2",label:"Emit head params",want:"head"},
      {id:"s3",label:"Read via soft attention",want:"rd"},
      {id:"s4",label:"Write via erase+add",want:"wr"},
    ],
    assemblePool:[
      {id:"ctrl",label:"LSTM controller",color:"var(--teal)"},
      {id:"head",label:"Head params (k, β, g, s, γ)",color:"var(--amber)"},
      {id:"rd",label:"r = Σ w_i M_i",color:"var(--iris)"},
      {id:"wr",label:"M := M(1-w·e) + w·a",color:"var(--sky)"},
      {id:"conv",label:"Conv layer",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Why is the memory access soft?",
        right:"So gradients flow through it",
        rightWhy:"Right — hard attention would break backprop.",
        wrongs:[["For faster retrieval","Actually slower."],
                ["To save memory","It uses the full memory each step."]]}
    ]
  }),

  "gpipe": makeLesson({
    id:"gpipe", title:"GPipe: Easy Scaling with Micro-Batch Pipeline Parallelism", authors:"Huang et al., 2018",
    hookHead:"One GPU isn't enough?", hookSub:"Pipeline them.",
    hookText:"Partition the model across N GPUs. Split a minibatch into micro-batches. Feed them through the pipeline — all GPUs work simultaneously on different stages.",
    intuitionTitle:"Assembly line.",
    intuitionIntro:"GPU 1 works on micro-batch k+2 while GPU 2 works on k+1 and GPU 3 on k. After a warm-up, everyone is busy.",
    cards:[{letter:"μ",title:"Micro-batch",sub:"fraction of batch",color:"var(--amber)"},
           {letter:"→",title:"Pipeline",sub:"stages across GPUs",color:"var(--iris)"}],
    playgroundKind:"pipeline",
    socratic:[
      {q:"Why micro-batches?", hint:"Look at the utilization diagram.",
       expected:"Without splitting, only one stage runs at a time (huge idle bubble). Micro-batching flattens the bubble — utilization goes from ~1/N to ~1."}
    ],
    assembleSlots:[
      {id:"s1",label:"Partition model into stages",want:"part"},
      {id:"s2",label:"Split batch into micro-batches",want:"micro"},
      {id:"s3",label:"Pipeline forward",want:"fwd"},
      {id:"s4",label:"Pipeline backward",want:"bwd"},
      {id:"s5",label:"Synchronous gradient update",want:"sync"},
    ],
    assemblePool:[
      {id:"part",label:"Model-parallel stages",color:"var(--teal)"},
      {id:"micro",label:"Micro-batches",color:"var(--amber)"},
      {id:"fwd",label:"Pipelined fwd passes",color:"var(--iris)"},
      {id:"bwd",label:"Pipelined bwd passes",color:"var(--sky)"},
      {id:"sync",label:"All-reduce gradients",color:"var(--lime)"},
      {id:"async",label:"Asynchronous SGD",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"What problem does GPipe solve?",
        right:"Model too large for one accelerator, keeping utilization high",
        rightWhy:"Yes.",
        wrongs:[["Data too large","That's data parallelism."],
                ["Slow training on small models","Overkill for that."]]}
    ]
  }),

  "ds2": makeLesson({
    id:"ds2", title:"Deep Speech 2: End-to-End Speech Recognition in English and Mandarin", authors:"Amodei et al., 2015",
    hookHead:"One model,", hookSub:"two languages, no phonemes.",
    hookText:"Big CTC-trained RNNs replace the traditional ASR pipeline. No hand-crafted phonemes, no pronunciation dictionary — just spectrogram in, characters out.",
    intuitionTitle:"CTC: align without alignment.",
    intuitionIntro:"CTC loss sums over all valid alignments of output characters to input frames, including blanks. Model learns timing from labels alone.",
    cards:[{letter:"∑",title:"CTC",sub:"sum over alignments",color:"var(--amber)"},
           {letter:"_",title:"Blank",sub:"repeat/skip",color:"var(--teal)"}],
    playgroundKind:"slider",
    socratic:[
      {q:"Why do we need the blank symbol in CTC?", hint:"Consider 'ab' vs 'abb' vs 'aabb'.",
       expected:"Without blanks, duplicated labels are ambiguous — can't tell 'll' (double) from 'l' (held). Blank lets the decoder insert separators."}
    ],
    assembleSlots:[
      {id:"s1",label:"Spectrogram input",want:"spec"},
      {id:"s2",label:"Conv front-end",want:"conv"},
      {id:"s3",label:"Stacked bi-RNN",want:"rnn"},
      {id:"s4",label:"Softmax over chars + blank",want:"soft"},
      {id:"s5",label:"CTC loss",want:"ctc"},
    ],
    assemblePool:[
      {id:"spec",label:"Log-mel spectrogram",color:"var(--amber)"},
      {id:"conv",label:"Conv 2D layers",color:"var(--teal)"},
      {id:"rnn",label:"Bi-directional GRUs",color:"var(--iris)"},
      {id:"soft",label:"Char-level softmax",color:"var(--sky)"},
      {id:"ctc",label:"CTC loss",color:"var(--lime)"},
      {id:"hmm",label:"HMM + GMM",color:"var(--rose)",decoy:true},
    ],
    mcq:[
      {q:"Deep Speech 2's break from the ASR pipeline?",
        right:"End-to-end: no phonemes, no dictionary",
        rightWhy:"Yes.",
        wrongs:[["Adds a larger language model","It has one but that's not the break."],
                ["Uses HMMs","Explicitly replaces HMMs."]]}
    ]
  }),
};

// ============= GENERIC LESSON BUILDER =============
// Turns terse inputs into a full lesson in the shared schema.
function makeLesson(x) {
  return {
    id: x.id, title: x.title, subtitle: x.authors, duration:"~10 min",
    hook: {
      headline: x.hookHead, subhead2: x.hookSub, subtext: x.hookText,
      tokens: [], highlight:[],
      beforeLabel:"Before", beforeSub:"",
      afterLabel:"After", afterSub:""
    },
    intuition: {
      title: x.intuitionTitle, intro: x.intuitionIntro,
      cards: x.cards
    },
    playground: { kind: x.playgroundKind || "slider", caption:"Explore the key parameters." },
    socratic: (x.socratic || []).map(s => ({ q:s.q, hint:s.hint, expected:s.expected })),
    assemble: { slots: x.assembleSlots, pool: x.assemblePool },
    mastery: (x.mcq || []).map(m => {
      const opts = [{t:m.right, ok:true, why:m.rightWhy}];
      (m.wrongs || []).forEach(w => opts.push({t:w[0], ok:false, why:w[1]}));
      // shuffle stable order: right first, then wrongs; shuffle deterministically by len
      return { prompt: m.q, options: shuffle(opts, m.q.length) };
    })
  };
}
function shuffle(a, seed) {
  // deterministic mini-shuffle
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i+1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Also register the existing Attention lesson in library form so all concepts work via one path
LESSON_LIB["transformer"] = {
  id:"transformer", title:"Attention Is All You Need", subtitle:"Vaswani et al., 2017 · NeurIPS",
  duration:"~18 min", isCustom:true // signals app to use the richer custom stages
};

window.LESSON_LIB = LESSON_LIB;
