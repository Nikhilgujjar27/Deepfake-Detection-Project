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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5" /> Threat Intelligence & Visual Forensics
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Visual Forensics Academy
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Learn the principles of identifying synthetic media, GAN boundary artifacts, diffusion glitches, and transformer self-attention cues.
        </p>
      </div>

      {/* 4 Forensic Indicators Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> Anatomical Failure Modes of Synthetic Faces
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="saas-card p-5 border border-slate-200 bg-white rounded-xl space-y-1.5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">1</span>
              Corneal Specular Reflection Asymmetry
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real camera sensors capture identical light reflections in both eyes from the physical scene light. AI models frequently synthesize mismatched reflection geometries or missing corneal highlights.
            </p>
          </div>

          <div className="saas-card p-5 border border-slate-200 bg-white rounded-xl space-y-1.5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">2</span>
              Ear Lobe & Jewelry Inconsistencies
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generators struggle with the intricate 3D topology of ear cartilage and jewelry, often resulting in melted earring attachments or mismatched left/right ear lobes.
            </p>
          </div>

          <div className="saas-card p-5 border border-slate-200 bg-white rounded-xl space-y-1.5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">3</span>
              Teeth & Interdental Separation Smearing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI-generated smiles often display continuous white tooth ribbons without distinct interdental separation, or misaligned incisors with blurry gum margins.
            </p>
          </div>

          <div className="saas-card p-5 border border-slate-200 bg-white rounded-xl space-y-1.5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">4</span>
              Face-Swap Boundary Blending Seams
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Face-swap deepfakes splice a source face onto a target image. The Poisson blending perimeter around the jawline and hairline often reveals resolution or skin-tone step discontinuities.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Forensic Spotter Quiz */}
      <div className="saas-card p-6 sm:p-8 border border-slate-200 bg-white rounded-xl space-y-6 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" /> Interactive Forensic Spotter Quiz
          </h2>
          <p className="text-xs text-slate-500 mt-1">Test your knowledge on synthetic media manipulation and transformer attention.</p>
        </div>

        <div className="space-y-6">
          {QUIZ_DATA.map((quiz, qIdx) => {
            const hasAnswered = showResults[quiz.id];
            const selectedOpt = selectedAnswers[quiz.id];
            const isCorrect = selectedOpt === quiz.correctIndex;

            return (
              <div key={quiz.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 leading-relaxed">{quiz.question}</h4>
                </div>

                <div className="text-[11px] text-slate-500 italic pl-7">
                  Hint: {quiz.clue}
                </div>

                {/* Options */}
                <div className="space-y-2 pl-7">
                  {quiz.options.map((opt, oIdx) => {
                    let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50";
                    if (hasAnswered) {
                      if (oIdx === quiz.correctIndex) {
                        btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-medium";
                      } else if (oIdx === selectedOpt && !isCorrect) {
                        btnStyle = "bg-rose-50 border-rose-300 text-rose-900";
                      } else {
                        btnStyle = "bg-white border-slate-100 text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(quiz.id, oIdx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${btnStyle}`}
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

                {/* Explanation */}
                {hasAnswered && (
                  <div
                    className={`ml-7 p-3 rounded-lg border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <strong className="block mb-0.5 font-semibold">
                      {isCorrect ? '✓ Correct Forensics Analysis' : '✗ Incorrect Diagnosis'}
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
