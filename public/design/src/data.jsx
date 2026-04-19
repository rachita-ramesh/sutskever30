// ============ CONCEPTS ============
// Papers from Ilya's list, clustered by theme with x/y for constellation layout.
// (x,y) in a 0..100 coord space, positioned by cluster.

const CLUSTERS = {
  "Sequence":   { color: "var(--teal)",  label: "Sequence" },
  "Attention":  { color: "var(--iris)",  label: "Attention" },
  "Vision":     { color: "var(--rose)",  label: "Vision" },
  "Theory":     { color: "var(--amber)", label: "Theory" },
  "Memory":     { color: "var(--sky)",   label: "Memory & Reasoning" },
  "Systems":    { color: "var(--lime)",  label: "Systems" },
};

const CONCEPTS = [
  // Sequence cluster (top-left)
  { id:"rnn-eff",     name:"Unreasonable RNNs",         cluster:"Sequence",  x:15, y:22, diff:1, year:2015, auth:"Karpathy",    prereqs:[],            paper:"https://karpathy.github.io/2015/05/21/rnn-effectiveness/" },
  { id:"lstm",        name:"Understanding LSTM",        cluster:"Sequence",  x:26, y:16, diff:1, year:2015, auth:"Olah",        prereqs:["rnn-eff"],   paper:"https://colah.github.io/posts/2015-08-Understanding-LSTMs/" },
  { id:"rnn-reg",     name:"RNN Regularization",        cluster:"Sequence",  x:22, y:32, diff:2, year:2014, auth:"Zaremba+",    prereqs:["lstm"],      paper:"https://arxiv.org/abs/1409.2329" },
  { id:"order",       name:"Order Matters",             cluster:"Sequence",  x:36, y:26, diff:3, year:2015, auth:"Vinyals+",    prereqs:["lstm"],      paper:"https://arxiv.org/abs/1511.06391" },

  // Attention cluster (center)
  { id:"bahdanau",    name:"Bahdanau Attention",        cluster:"Attention", x:46, y:36, diff:3, year:2014, auth:"Bahdanau+",   prereqs:["lstm"],      paper:"https://arxiv.org/abs/1409.0473" },
  { id:"pointer",     name:"Pointer Networks",          cluster:"Attention", x:54, y:28, diff:3, year:2015, auth:"Vinyals+",    prereqs:["bahdanau"],  paper:"https://arxiv.org/abs/1506.03134" },
  { id:"transformer", name:"Attention Is All You Need", cluster:"Attention", x:56, y:46, diff:3, year:2017, auth:"Vaswani+",    prereqs:["bahdanau"],  paper:"https://arxiv.org/abs/1706.03762", star:true },
  { id:"annotated",   name:"Annotated Transformer",     cluster:"Attention", x:66, y:40, diff:2, year:2018, auth:"Rush",        prereqs:["transformer"], paper:"https://nlp.seas.harvard.edu/annotated-transformer/" },

  // Vision cluster (lower-left)
  { id:"alexnet",     name:"AlexNet",                   cluster:"Vision",    x:18, y:56, diff:2, year:2012, auth:"Krizhevsky+", prereqs:[],            paper:"https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" },
  { id:"resnet",      name:"Deep Residual",             cluster:"Vision",    x:28, y:68, diff:2, year:2015, auth:"He+",         prereqs:["alexnet"],   paper:"https://arxiv.org/abs/1512.03385" },
  { id:"identity",    name:"Identity Mappings",         cluster:"Vision",    x:38, y:78, diff:3, year:2016, auth:"He+",         prereqs:["resnet"],    paper:"https://arxiv.org/abs/1603.05027" },
  { id:"dilated",     name:"Dilated Convolutions",      cluster:"Vision",    x:14, y:76, diff:2, year:2015, auth:"Yu+",         prereqs:["alexnet"],   paper:"https://arxiv.org/abs/1511.07122" },
  { id:"cs231n",      name:"CS231n",                    cluster:"Vision",    x:8,  y:64, diff:1, year:2015, auth:"Stanford",    prereqs:[],            paper:"https://cs231n.stanford.edu/" },

  // Theory cluster (right)
  { id:"mdl-simple",  name:"Keeping NNs Simple",        cluster:"Theory",    x:82, y:22, diff:3, year:1993, auth:"Hinton+",     prereqs:[],            paper:"https://www.cs.toronto.edu/~hinton/absps/colt93.pdf" },
  { id:"mdl-tut",     name:"MDL Tutorial",              cluster:"Theory",    x:90, y:32, diff:3, year:2004, auth:"Grünwald",    prereqs:[],            paper:"https://arxiv.org/abs/math/0406077" },
  { id:"kolmo",       name:"Kolmogorov Complexity",     cluster:"Theory",    x:86, y:44, diff:3, year:2017, auth:"Shen+",       prereqs:["mdl-tut"],   paper:"https://www.lirmm.fr/~ashen/kolmbook-eng-scan.pdf" },
  { id:"scaling",     name:"Scaling Laws",              cluster:"Theory",    x:78, y:54, diff:3, year:2020, auth:"Kaplan+",     prereqs:[],            paper:"https://arxiv.org/abs/2001.08361" },
  { id:"complexo",    name:"Complexodynamics",          cluster:"Theory",    x:94, y:62, diff:3, year:2011, auth:"Aaronson",    prereqs:[],            paper:"https://www.scottaaronson.com/blog/?p=762" },
  { id:"coffee",      name:"Coffee Automaton",          cluster:"Theory",    x:82, y:70, diff:3, year:2014, auth:"Aaronson+",   prereqs:["complexo"],  paper:"https://arxiv.org/abs/1405.6903" },
  { id:"msi",         name:"Machine Super Intelligence",cluster:"Theory",    x:76, y:14, diff:3, year:2008, auth:"Legg",        prereqs:[],            paper:"https://www.vetta.org/documents/Machine_Super_Intelligence.pdf" },

  // Memory & Reasoning cluster (bottom-center)
  { id:"ntm",         name:"Neural Turing Machines",    cluster:"Memory",    x:46, y:74, diff:3, year:2014, auth:"Graves+",     prereqs:[],            paper:"https://arxiv.org/abs/1410.5401" },
  { id:"vlae",        name:"Variational Lossy AE",      cluster:"Memory",    x:50, y:86, diff:3, year:2016, auth:"Chen+",       prereqs:[],            paper:"https://arxiv.org/abs/1611.02731" },
  { id:"relrea",      name:"Relational Reasoning",      cluster:"Memory",    x:62, y:74, diff:3, year:2017, auth:"Santoro+",    prereqs:[],            paper:"https://arxiv.org/abs/1706.01427" },
  { id:"relrnn",      name:"Relational RNNs",           cluster:"Memory",    x:70, y:84, diff:3, year:2018, auth:"Santoro+",    prereqs:["relrea"],    paper:"https://arxiv.org/abs/1806.01822" },
  { id:"msg",         name:"Neural Message Passing",    cluster:"Memory",    x:60, y:90, diff:3, year:2017, auth:"Gilmer+",     prereqs:[],            paper:"https://arxiv.org/abs/1704.01212" },

  // Systems cluster (far-right-bottom + one outlier)
  { id:"gpipe",       name:"GPipe",                     cluster:"Systems",   x:88, y:84, diff:3, year:2018, auth:"Huang+",      prereqs:[],            paper:"https://arxiv.org/abs/1811.06965" },
  { id:"ds2",         name:"Deep Speech 2",             cluster:"Systems",   x:44, y:12, diff:2, year:2015, auth:"Amodei+",     prereqs:[],            paper:"https://arxiv.org/abs/1512.02595" },
];

// ============ ATTENTION LESSON ============
// Stage definitions used by the Transformer lesson.
const LESSON = {
  id: "transformer",
  title: "Attention Is All You Need",
  subtitle: "Vaswani et al., 2017 · NeurIPS",
  duration: "~18 min",
  stages: [
    { id:"hook",      label:"Hook",        kind:"hook",        minutes: 1 },
    { id:"intuition", label:"Intuition",   kind:"intuition",   minutes: 3 },
    { id:"playground",label:"Playground",  kind:"playground",  minutes: 5 },
    { id:"socratic",  label:"Socratic",    kind:"socratic",    minutes: 2 },
    { id:"assemble",  label:"Assemble",    kind:"assemble",    minutes: 4 },
    { id:"mastery",   label:"Mastery",     kind:"mastery",     minutes: 3 },
  ]
};

// sentence used in attention playground
const ATTN_SENT = ["The","animal","didn't","cross","the","street","because","it","was","too","tired"];
// head presets as weight rows (per query idx, weights over keys)
const HEADS = {
  syntactic:   { name:"Head 1 · Syntactic",   hue: "var(--sky)",
    hint:"attends to neighbors" },
  coreference: { name:"Head 2 · Coreference", hue: "var(--iris)",
    hint:"links pronouns to antecedents" },
  content:     { name:"Head 3 · Content",     hue: "var(--teal)",
    hint:"links verbs to their subjects" },
};

// Compute weights at render-time from simple rules (more alive than static)
function attnWeights(headId, qi, N) {
  const w = new Array(N).fill(0.02);
  if (headId === "syntactic") {
    for (let j=0; j<N; j++) w[j] = Math.exp(-Math.abs(qi-j)/1.1);
  } else if (headId === "coreference") {
    for (let j=0; j<N; j++) w[j] = 0.02;
    if (qi===7) { w[1]=0.72; w[10]=0.1; w[7]=0.1; }
    else if (qi===1) { w[1]=0.2; w[7]=0.55; w[10]=0.15; }
    else if (qi===10) { w[10]=0.2; w[1]=0.45; w[7]=0.25; }
    else { for (let j=0; j<N; j++) w[j] = Math.exp(-Math.abs(qi-j)/3.0); }
  } else if (headId === "content") {
    for (let j=0; j<N; j++) w[j] = 0.02;
    if (qi===2) { w[1]=0.6; w[3]=0.25; }    // didn't → animal, cross
    else if (qi===3) { w[5]=0.55; w[1]=0.3; }// cross → street, animal
    else if (qi===10) { w[1]=0.6; w[7]=0.25; }
    else { for (let j=0; j<N; j++) w[j] = Math.exp(-Math.abs(qi-j)/2.0); }
  }
  const s = w.reduce((a,b)=>a+b,0);
  return w.map(x=>x/s);
}

// Socratic questions
const SOCRATIC = [
  {
    q:"Before you read further — why do you think dividing by √dₖ helps?",
    hint:"Think about what happens to dot products as dimension grows.",
    expected:"As dₖ grows, dot-product magnitudes grow like √dₖ. Without scaling, softmax saturates and gradients vanish.",
  },
  {
    q:"If attention already looks everywhere, why do we need multiple heads?",
    hint:"Could one set of Q/K/V represent syntax and coreference at once?",
    expected:"A single softmax row can only express one soft-alignment at a time. Multi-head lets the model attend to different subspaces / relationships in parallel.",
  },
];

// Mastery questions
const MASTERY_QS = [
  {
    prompt:"Which element of the Transformer breaks the sequential bottleneck of RNNs?",
    options:[
      { t:"Layer normalization", ok:false, why:"LayerNorm stabilizes training but doesn't parallelize time." },
      { t:"Self-attention — every position sees every position in one shot", ok:true, why:"Right. Because all positions are computed in parallel, the step-by-step dependency disappears." },
      { t:"Residual connections", ok:false, why:"Residuals help gradient flow, not parallelism." },
    ]
  },
  {
    prompt:"You set softmax temperature τ → 0. What happens to the attention distribution?",
    options:[
      { t:"It becomes uniform over all keys", ok:false, why:"That's τ → ∞." },
      { t:"It collapses to one-hot on the argmax key", ok:true, why:"Correct. Low temperature sharpens." },
      { t:"It becomes negative", ok:false, why:"Softmax outputs are always in [0,1]." },
    ]
  },
  {
    prompt:"Why scale dot products by 1/√dₖ?",
    options:[
      { t:"To normalize the values V", ok:false, why:"Scaling acts on scores, not V." },
      { t:"To prevent the softmax from saturating in high dimensions", ok:true, why:"Exactly. Raw dot products grow like √dₖ, saturating softmax → vanishing gradients." },
      { t:"To make training deterministic", ok:false, why:"It's about gradient magnitude, not determinism." },
    ]
  },
];

window.DATA = { CLUSTERS, CONCEPTS, LESSON, ATTN_SENT, HEADS, attnWeights, SOCRATIC, MASTERY_QS };
