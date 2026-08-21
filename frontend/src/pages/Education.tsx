import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, XCircle, HelpCircle, ChevronDown, ChevronUp, RotateCcw, Award } from 'lucide-react';

interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  clue: string;
}

const QUIZ_DATA: QuizItem[] = [
  {
    id: 1,
    question: "What is the most reliable visual artifact indicating a StyleGAN-generated synthetic face?",
    options: [
      "Mismatch in background color",
      "Asymmetrical corneal specular highlights and unnatural ear lobe geometries",
      "Slight skin tone variation across forehead",
      "Camera shake motion blur"
    ],
    correctIndex: 1,
    explanation: "StyleGAN synthesizes eyes independently without physical 3D light-source ray tracing, frequently producing mismatched specular reflections in the pupils and distorted ear boundaries.",
    clue: "Inspect the reflection light dots inside the left vs right pupils."
  },
  {
    id: 2,
    question: "Why do standard CNN detectors often fail on real smartphone photos sent via WhatsApp?",
    options: [
      "Smartphones have lower resolution than training sets",
      "WhatsApp compression and ISO sensor noise trigger false boundary artifact activations",
      "CNNs only operate on grayscale images",
      "Smartphone cameras invert color channels"
    ],
    correctIndex: 1,
    explanation: "Casual mobile photography introduces chroma subsampling, JPEG block compression, and low-light ISO sensor grain, which uncalibrated models misinterpret as synthetic noise.",
    clue: "Consider the lossy compression artifacts introduced during messaging transmission."
  },
  {
    id: 3,
    question: "How does a Vision Transformer (ViT) analyze a facial image differently than a Convolutional Neural Network?",
    options: [
      "ViT divides the face into 196 discrete tokens and computes global relational self-attention across all patches",
      "ViT scans one pixel at a time from top to bottom",
      "ViT only inspects the center 10% of the image",
      "ViT relies strictly on hand-crafted edge detection filters"
    ],
    correctIndex: 0,
    explanation: "ViT-Base divides 224×224 images into 16×16 patches (196 tokens) and computes pairwise multi-head self-attention, detecting inconsistencies between distant facial regions (e.g. left eye vs right eye).",
    clue: "Transformers compute token attention matrices."
  }
];

const ANATOMICAL_FAILURES = [
  {
    id: 1,
    title: "Corneal Specular Reflection Asymmetry",
    summary: "Mismatched or missing pupil light reflections from physical scene lighting.",
    details: "Real cameras capture identical light reflections in both eyes from the physical scene light. AI models frequently generate mismatched reflection shapes, distorted highlights, or completely missing corneal reflections in one eye.",
    cue: "Look for light glints in both pupils. In genuine captures, the position and shape of the light source will match exactly."
  },
  {
    id: 2,
    title: "Ear Lobe & Jewelry Topology Gaps",
    summary: "Melted earring attachments and non-symmetrical cartilage structures.",
    details: "Generators struggle with the intricate 3D topology of ear cartilage, ear piercings, and dangling jewelry. This results in melted earring attachments, discontinuous chains, or mismatched left/right ear lobe shapes.",
    cue: "Examine where jewelry meets skin. Synthetic images often exhibit floating metals or blurred ear contours."
  },
  {
    id: 3,
    title: "Teeth & Interdental Separation Smearing",
    summary: "Monolithic white tooth ribbons without distinct individual dental margins.",
    details: "AI-generated smiles often show continuous monolithic white tooth ribbons without distinct interdental separation, or misaligned incisors with blurry gum margins and inconsistent tooth counts.",
    cue: "Zoom in on the smile line. Authentic photos show sharp enamel boundaries and gum papilla."
  },
  {
    id: 4,
    title: "Face-Swap Boundary Blending Seams",
    summary: "Poisson blending perimeter discontinuities along jawlines and hairlines.",
    details: "Face-swap deepfakes splice a source face onto a target video frame. The Poisson blending perimeter around the jawline, chin, and forehead often exhibits subtle resolution or skin-tone step discontinuities.",
    cue: "Check the perimeter of the face near the hairline and jawline for slight blur or texture mismatches."
  }
];

export const Education: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelectOption = (quizId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIdx }));
    setShowResults((prev) => ({ ...prev, [quizId]: true }));
  };

  const answeredCount = Object.keys(showResults).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([id, ans]) => QUIZ_DATA.find((q) => q.id === Number(id))?.correctIndex === ans
  ).length;

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <BookOpen className="w-3.5 h-3.5" /> Threat Intelligence & Visual Forensics
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
          Visual Forensics Academy
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Master the principles of identifying synthetic media, GAN boundary artifacts, diffusion glitches, and Vision Transformer self-attention cues.
        </p>
      </div>

      {/* 4 Anatomical Failure Modes with Expandable Details */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> The 4 Anatomical Failure Modes of Synthetic Faces
          </h2>
          <span className="text-xs font-semibold text-slate-400">Click any card to inspect forensic cues</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ANATOMICAL_FAILURES.map((item) => {
            const isOpen = expandedCard === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedCard(isOpen ? null : item.id)}
                className={`forensic-card p-6 border transition-all duration-200 cursor-pointer space-y-3 ${
                  isOpen ? 'border-blue-500 bg-blue-50/20 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center border border-blue-100 shadow-xs">
                      {item.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                {isOpen && (
                  <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs text-slate-600 animate-in fade-in duration-200">
                    <p className="leading-relaxed">{item.details}</p>
                    <div className="p-3 rounded-lg bg-white border border-blue-200/60 text-blue-900 font-medium">
                      <strong>Forensic Inspection Tip:</strong> {item.cue}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Forensic Spotter Quiz */}
      <div className="forensic-card p-6 sm:p-10 border border-slate-200 bg-white rounded-2xl space-y-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" /> Interactive Forensic Spotter Quiz
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Test your visual forensic literacy against synthetic media manipulation.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Score: {correctCount} / {QUIZ_DATA.length}</span>
            </div>
            {answeredCount > 0 && (
              <button
                onClick={resetQuiz}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Question Cards */}
        <div className="space-y-6">
          {QUIZ_DATA.map((quiz, qIdx) => {
            const hasAnswered = showResults[quiz.id];
            const selectedOpt = selectedAnswers[quiz.id];
            const isCorrect = selectedOpt === quiz.correctIndex;

            return (
              <div key={quiz.id} className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {quiz.question}
                  </h4>
                </div>

                <div className="text-xs text-slate-500 italic pl-9">
                  Clue: {quiz.clue}
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pl-9">
                  {quiz.options.map((opt, oIdx) => {
                    let btnStyle = "bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50";
                    if (hasAnswered) {
                      if (oIdx === quiz.correctIndex) {
                        btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs";
                      } else if (oIdx === selectedOpt && !isCorrect) {
                        btnStyle = "bg-rose-50 border-rose-300 text-rose-950 font-medium";
                      } else {
                        btnStyle = "bg-white border-slate-100 text-slate-400 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(quiz.id, oIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && oIdx === quiz.correctIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                        )}
                        {hasAnswered && oIdx === selectedOpt && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {hasAnswered && (
                  <div
                    className={`ml-9 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <strong className="block mb-1 font-bold">
                      {isCorrect ? '✓ Correct Forensics Analysis!' : '✗ Incorrect Diagnosis'}
                    </strong>
                    {quiz.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
