// ============ CONCEPTS ============
// 30 papers from Ilya's list, clustered by theme with x/y for constellation layout.
// (x,y) in a 0..100 coord space, positioned by cluster.

const CLUSTERS = {
  "Sequence":    { color: "var(--teal)",  label: "Sequence" },
  "Attention":   { color: "var(--iris)",  label: "Attention" },
  "Vision":      { color: "var(--rose)",  label: "Vision" },
  "Theory":      { color: "var(--amber)", label: "Theory" },
  "Generative":  { color: "var(--sky)",   label: "Generative" },
  "Infra":       { color: "var(--lime)",  label: "Infra" },
};

const CONCEPTS = [
  // Sequence cluster (top-left)
  { id:"rnn-eff",     name:"Unreasonable RNNs",     cluster:"Sequence",  x:15, y:22, diff:1, year:2015, auth:"Karpathy",          prereqs:[] },
  { id:"lstm",        name:"Understanding LSTM",    cluster:"Sequence",  x:26, y:16, diff:1, year:2015, auth:"Olah",              prereqs:["rnn-eff"] },
  { id:"rnn-reg",     name:"RNN Regularization",    cluster:"Sequence",  x:22, y:32, diff:2, year:2014, auth:"Zaremba+",          prereqs:["lstm"] },
  { id:"order",       name:"Order Matters",         cluster:"Sequence",  x:36, y:26, diff:3, year:2015, auth:"Vinyals+",          prereqs:["lstm"] },

  // Attention cluster (center)
  { id:"bahdanau",    name:"Bahdanau Attention",    cluster:"Attention", x:46, y:36, diff:3, year:2014, auth:"Bahdanau+",         prereqs:["lstm"] },
  { id:"pointer",     name:"Pointer Networks",      cluster:"Attention", x:54, y:28, diff:3, year:2015, auth:"Vinyals+",          prereqs:["bahdanau"] },
  { id:"transformer", name:"Attention Is All You Need", cluster:"Attention", x:56, y:46, diff:3, year:2017, auth:"Vaswani+",      prereqs:["bahdanau"], star:true },
  { id:"annotated",   name:"Annotated Transformer", cluster:"Attention", x:66, y:40, diff:2, year:2018, auth:"Rush",              prereqs:["transformer"] },
  { id:"scaling",     name:"Scaling Laws",          cluster:"Attention", x:64, y:54, diff:3, year:2020, auth:"Kaplan+",           prereqs:["transformer"] },

  // Vision cluster (lower-left)
  { id:"alexnet",     name:"AlexNet",               cluster:"Vision",    x:18, y:56, diff:2, year:2012, auth:"Krizhevsky+",       prereqs:[] },
  { id:"resnet",      name:"Deep Residual",         cluster:"Vision",    x:28, y:68, diff:2, year:2015, auth:"He+",               prereqs:["alexnet"] },
  { id:"identity",    name:"Identity Mappings",     cluster:"Vision",    x:38, y:78, diff:3, year:2016, auth:"He+",               prereqs:["resnet"] },
  { id:"dilated",     name:"Dilated Convolutions",  cluster:"Vision",    x:14, y:76, diff:2, year:2015, auth:"Yu+",               prereqs:["alexnet"] },
  { id:"cs231n",      name:"CS231n",                cluster:"Vision",    x:8,  y:64, diff:1, year:2015, auth:"Stanford",          prereqs:[] },

  // Theory cluster (right)
  { id:"mdl-simple",  name:"Keeping NNs Simple",    cluster:"Theory",    x:82, y:22, diff:3, year:1993, auth:"Hinton+",           prereqs:[] },
  { id:"mdl-tut",     name:"MDL Tutorial",          cluster:"Theory",    x:90, y:32, diff:3, year:2004, auth:"Grünwald",          prereqs:[] },
  { id:"kolmo",       name:"Kolmogorov Complexity", cluster:"Theory",    x:86, y:48, diff:3, year:2017, auth:"Shen+",             prereqs:["mdl-tut"] },
  { id:"complexo",    name:"Complexodynamics",      cluster:"Theory",    x:94, y:62, diff:3, year:2011, auth:"Aaronson",          prereqs:[] },
  { id:"coffee",      name:"Coffee Automaton",      cluster:"Theory",    x:82, y:70, diff:3, year:2014, auth:"Aaronson+",         prereqs:["complexo"] },
  { id:"msi",         name:"Machine Super Intelligence", cluster:"Theory", x:76, y:14, diff:3, year:2008, auth:"Legg",           prereqs:[] },

  // Generative cluster (bottom)
  { id:"vlae",        name:"Variational Lossy AE",  cluster:"Generative", x:50, y:82, diff:3, year:2016, auth:"Chen+",            prereqs:[] },
  { id:"relrea",      name:"Relational Reasoning",  cluster:"Generative", x:62, y:74, diff:3, year:2017, auth:"Santoro+",         prereqs:[] },
  { id:"relrnn",      name:"Relational RNNs",       cluster:"Generative", x:72, y:84, diff:3, year:2018, auth:"Santoro+",         prereqs:["relrea"] },
  { id:"msg",         name:"Neural Message Passing",cluster:"Generative", x:60, y:90, diff:3, year:2017, auth:"Gilmer+",          prereqs:[] },

  // Infra cluster (far-right-bottom)
  { id:"ntm",         name:"Neural Turing Machines",cluster:"Infra",      x:42, y:58, diff:3, year:2014, auth:"Graves+",          prereqs:[] },
  { id:"gpipe",       name:"GPipe",                 cluster:"Infra",      x:88, y:84, diff:3, year:2018, auth:"Huang+",           prereqs:[] },
  { id:"ds2",         name:"Deep Speech 2",         cluster:"Infra",      x:44, y:12, diff:2, year:2015, auth:"Amodei+",          prereqs:[] },
];

// Current user progress (in-memory state, could persist)
const DEFAULT_MASTERY = {
  "rnn-eff":    { progress: 0.9, streak: 4, lastSeen: "2d" },
  "lstm":       { progress: 0.75, streak: 2, lastSeen: "5d" },
  "alexnet":    { progress: 0.55, streak: 1, lastSeen: "1w" },
  "resnet":     { progress: 0.3, streak: 0, lastSeen: "2w" },
  "bahdanau":   { progress: 0.2, streak: 0, lastSeen: "-" },
  "transformer":{ progress: 0.0, streak: 0, lastSeen: "-" },
};

// ============ ATTENTION LESSON ============
// Reimagined as stages, each with a distinct interaction type.
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

// Paper excerpt for annotated reader
const PAPER_EXCERPT = [
  { kind:"h", text:"3.2 Attention" },
  { kind:"p", text:"An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors." },
  { kind:"p", text:"The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key." },
  { kind:"h", text:"3.2.1 Scaled Dot-Product Attention" },
  { kind:"p", text:"We call our particular attention 'Scaled Dot-Product Attention'. The input consists of queries and keys of dimension $d_k$, and values of dimension $d_v$." },
  { kind:"eq", text:"Attention(Q, K, V) = softmax( Q Kᵀ / √dₖ ) V",
    plain:"For every query, dot it with every key to get a score. Divide by √dₖ so the softmax doesn't saturate. Softmax turns scores into weights that sum to 1. Weighted-sum the values."
  },
  { kind:"p", text:"The two most commonly used attention functions are additive attention, and dot-product (multiplicative) attention. Dot-product attention is identical to our algorithm, except for the scaling factor of 1/√dₖ." },
  { kind:"p", text:"While for small values of $d_k$ the two mechanisms perform similarly, additive attention outperforms dot product attention without scaling for larger values of $d_k$. We suspect that for large values of $d_k$, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients." },
];

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

window.DATA = { CLUSTERS, CONCEPTS, DEFAULT_MASTERY, LESSON, ATTN_SENT, HEADS, attnWeights, PAPER_EXCERPT, SOCRATIC, MASTERY_QS };
