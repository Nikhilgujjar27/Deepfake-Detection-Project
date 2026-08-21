import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

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
      "Asymmetrical eye reflections (specular highlights) and unnatural ear lobe geometries",
      "Slight skin tone variation",
      "Camera shake blur"
    ],
    correctIndex: 1,
    explanation: "StyleGAN synthesizes eyes independently without physical 3D light-source ray tracing, often producing mismatched specular reflections in the pupils and distorted ear boundaries.",
    clue: "Look closely at the light reflection dots inside the pupils."
  },
  {
    id: 2,
    question: "Why do standard CNN detectors often fail on real smartphone photos sent via WhatsApp?",
    options: [
      "Smartphones have lower resolution than training sets",
      "WhatsApp compression and ISO sensor noise trigger false boundary artifact activations",
      "CNNs only work on grayscale images",
      "Smartphone cameras invert color channels"
    ],
    correctIndex: 1,
    explanation: "Casual mobile photography introduces chroma subsampling, JPEG block compression, and low-light ISO sensor grain, which uncalibrated models misinterpret as synthetic noise.",
    clue: "Think about what happens to an image when it gets compressed during messaging."
  },
  {
    id: 3,
    question: "How does a Vision Transformer (ViT) analyze a facial image differently than a Convolutional Neural Network?",
    options: [
      "ViT divides the face into 196 discrete tokens and computes global relational self-attention across all patches",
      "ViT scans one pixel at a time from top to bottom",
      "ViT only looks at the center 10% of the image",
      "ViT relies strictly on edge detection filters"
    ],
    correctIndex: 0,
    explanation: "ViT-Base divides 224×224 images into 16×16 patches (196 tokens) and computes pairwise multi-head self-attention, detecting inconsistencies between distant facial regions (e.g. left eye vs right eye).",
    clue: "Transformer models process tokens and attention matrices."
  }
];

export const Education: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelectOption = (quizId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIdx }));
    setShowResults((prev) => ({ ...prev, [quizId]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Deepfake Threat Intelligence & Forensics
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Deepfake Forensic Academy
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Master the science of identifying synthetic media, GAN boundary artifacts, diffusion glitches, and transformer self-attention cues.
        </p>
      </div>

      {/* 5 Forensic Indicators Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> The 5 Anatomical Failure Modes of AI Faces
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-mono flex items-center justify-center">1</span>
              Corneal Specular Reflection Asymmetry
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real cameras capture identical light reflections in both eyes from the physical scene light. AI models frequently generate mismatched reflection shapes or completely missing reflections in one eye.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-mono flex items-center justify-center">2</span>
              Ear Lobe & Earring Inconsistencies
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generators struggle with the intricate 3D topology of ear cartilage and jewelry, resulting in melted earring attachments or mismatched left/right ear lobe shapes.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-mono flex items-center justify-center">3</span>
              Teeth & Gum Boundary Smearing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-generated smiles often show continuous monolithic white tooth ribbons without distinct interdental separation, or misaligned incisors with blurry gum margins.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-mono flex items-center justify-center">4</span>
              FaceSwap Boundary Blending Seams
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Face-swap deepfakes splice a source face onto a target video frame. The Poisson blending perimeter around the jawline and forehead often exhibits subtle resolution or skin-tone step discontinuities.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Forensic Spotter Quiz */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" /> Interactive Forensic Spotter Quiz
          </h2>
          <p className="text-xs text-slate-400 mt-1">Test your visual forensic literacy against synthetic media manipulation.</p>
        </div>

        <div className="space-y-6">
          {QUIZ_DATA.map((quiz, qIdx) => {
            const hasAnswered = showResults[quiz.id];
            const selectedOpt = selectedAnswers[quiz.id];
            const isCorrect = selectedOpt === quiz.correctIndex;

            return (
              <div key={quiz.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center flex-shrink-0">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white leading-relaxed">{quiz.question}</h4>
                </div>

                {/* Clue */}
                <div className="text-[11px] text-slate-500 font-mono italic pl-9">
                  Clue: {quiz.clue}
                </div>

                {/* Options */}
                <div className="space-y-2 pl-9">
                  {quiz.options.map((opt, oIdx) => {
                    let btnStyle = "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-850";
                    if (hasAnswered) {
                      if (oIdx === quiz.correctIndex) {
                        btnStyle = "bg-emerald-950/70 border-emerald-600 text-emerald-200";
                      } else if (oIdx === selectedOpt && !isCorrect) {
                        btnStyle = "bg-rose-950/70 border-rose-600 text-rose-200";
                      } else {
                        btnStyle = "bg-slate-900/40 border-slate-850 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(quiz.id, oIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && oIdx === quiz.correctIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                        )}
                        {hasAnswered && oIdx === selectedOpt && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {hasAnswered && (
                  <div
                    className={`ml-9 p-3.5 rounded-xl border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
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
