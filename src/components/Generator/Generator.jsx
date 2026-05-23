import { useState } from 'react';
import StepTracker from './StepTracker';
import StepResume from './StepResume';
import StepJobDescription from './StepJobDescription';
import StepIntelligence from './StepIntelligence';
import StepCustomize from './StepCustomize';
import StepOutput from './StepOutput';
import StepInterviewPrep from './StepInterviewPrep';
import { useGenerator } from '../../hooks/useGenerator';
import styles from './Generator.module.css';

const DEFAULT_SETTINGS = {
  model: 'llama-3.3-70b-versatile',
  tone: 'yc_startup',
  length: 'standard',
  focus: [],
  pivotContext: '',
  metricContext: '',
  companyContext: '',
};

export default function Generator() {
  const [step, setStep]         = useState(1);
  const [resume, setResume]     = useState('');
  const [jobDesc, setJobDesc]   = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const {
    status, outputText, rationaleText, matchScore,
    errorMsg, loadingStep, intelligenceData,
    interviewQuestions, interviewLoading,
    generate, analyzeFit, generateInterviewPrep, refine, LOADING_STEPS,
  } = useGenerator();

  // Unlocking logic
  let highestUnlocked = 1;
  if (resume && resume.length >= 30) highestUnlocked = 2;
  if (highestUnlocked === 2 && jobDesc && jobDesc.length >= 30) highestUnlocked = 3;
  if (highestUnlocked === 3 && intelligenceData) highestUnlocked = 4;
  if (highestUnlocked === 4) highestUnlocked = 5;
  if (highestUnlocked === 5 && outputText) highestUnlocked = 6;

  const handleAnalyzeFit = () => {
    setStep(3);
    analyzeFit({ resume, jobDesc }).catch(() => {});
  };

  const handleGenerate = () => {
    if (highestUnlocked < 4) return;
    setStep(5);
    generate({ resume, jobDesc, ...settings });
  };

  const handleRegenerate = () => {
    generate({ resume, jobDesc, ...settings });
  };

  const handlePrepInterview = () => {
    setStep(6);
    generateInterviewPrep({
      resume,
      jobDesc,
      rejectionRisk: intelligenceData?.rejectionRisk || '',
    });
  };

  const handleDone = () => {
    setStep(1);
    setResume('');
    setJobDesc('');
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <section className={styles.section} id="generate">
      <div className={styles.inner}>
        <div className="section-badge" style={{ marginBottom: '20px' }}>AI Copilot</div>
        <h2 className={styles.sectionTitle}>Your Job Application Copilot</h2>
        <p className={styles.sectionSubtitle}>Intelligence first. Strategy second. Generation last.</p>

        <StepTracker
          currentStep={step}
          highestUnlocked={highestUnlocked}
          onStepClick={setStep}
        />

        <div className={styles.stepsContainer}>
          {step === 1 && (
            <StepResume resume={resume} onChange={setResume} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepJobDescription jobDesc={jobDesc} onChange={setJobDesc} onNext={handleAnalyzeFit} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <StepIntelligence status={status} errorMsg={errorMsg} intelligenceData={intelligenceData} onBack={() => setStep(2)} onNext={() => setStep(4)} />
          )}
          {step === 4 && (
            <StepCustomize settings={settings} onChange={setSettings} onBack={() => setStep(3)} onGenerate={handleGenerate} />
          )}
          {step === 5 && (
            <StepOutput
              status={status}
              outputText={outputText}
              rationaleText={rationaleText}
              matchScore={matchScore}
              errorMsg={errorMsg}
              loadingStep={loadingStep}
              LOADING_STEPS={LOADING_STEPS}
              onRegenerate={handleRegenerate}
              onRefine={refine}
              onBack={() => setStep(4)}
              onPrepInterview={handlePrepInterview}
            />
          )}
          {step === 6 && (
            <StepInterviewPrep
              interviewQuestions={interviewQuestions}
              interviewLoading={interviewLoading}
              onBack={() => setStep(5)}
              onDone={handleDone}
            />
          )}
        </div>
      </div>
    </section>
  );
}
