import { useState, useRef, useCallback } from 'react';
import { parseResumeFile, ACCEPTED_TYPES, MAX_FILE_SIZE_MB } from '../../utils/fileParser';
import QualityMeter from './QualityMeter';
import styles from './StepResume.module.css';
import panelStyles from './StepPanel.module.css';

const TIPS = [
  { title: 'Include quantified achievements', desc: 'Numbers make you memorable. "Grew revenue by 40%" beats "improved sales."' },
  { title: 'List all relevant skills', desc: 'Include technical tools, methodologies, and domain expertise.' },
  { title: 'Add education & certifications', desc: 'These can be differentiators, especially for competitive roles.' },
  { title: 'Keep it complete but concise', desc: 'Upload your full resume - the AI will intelligently select what to highlight.' },
];

export default function StepResume({ resume, onChange, onNext }) {
  const [dragOver, setDragOver]   = useState(false);
  const [fileName, setFileName]   = useState('');
  const [parsing,  setParsing]    = useState(false);
  const [parseErr, setParseErr]   = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    // Size check
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setParseErr(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setParsing(true);
    setParseErr('');
    setFileName(file.name);

    try {
      const text = await parseResumeFile(file);
      if (!text || text.length < 30) throw new Error('Could not extract text. Try copy-pasting your resume instead.');
      onChange(text);
      setInputMode('paste'); // show the extracted text
    } catch (err) {
      setParseErr(err.message || 'Failed to parse file.');
      setFileName('');
    } finally {
      setParsing(false);
    }
  }, [onChange]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const onFileInput = (e) => handleFile(e.target.files[0]);

  const clearFile = () => {
    onChange('');
    setFileName('');
    setParseErr('');
    setInputMode('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={panelStyles.panelInner}>
      <div className={panelStyles.main}>

        {/* Header */}
        <div className={panelStyles.stepHeader}>
          <div className={panelStyles.iconCircle}>01</div>
          <div>
            <h3 className={panelStyles.stepTitle}>Your Resume</h3>
            <p className={panelStyles.stepDesc}>Upload your resume or paste the text - we'll extract everything automatically.</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${inputMode === 'upload' ? styles.modeBtnActive : ''}`}
            onClick={() => setInputMode('upload')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload File
          </button>
          <button
            className={`${styles.modeBtn} ${inputMode === 'paste' ? styles.modeBtnActive : ''}`}
            onClick={() => setInputMode('paste')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Paste Text
          </button>
        </div>

        {/* UPLOAD MODE */}
        {inputMode === 'upload' && (
          <div>
            {/* Drop zone */}
            <div
              className={`${styles.dropZone} ${dragOver ? styles.dropZoneDragOver : ''} ${parsing ? styles.dropZoneParsing : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => !parsing && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={onFileInput}
                className={styles.hiddenInput}
              />

              {parsing ? (
                <div className={styles.parsingState}>
                  <div className={styles.parsingSpinner}></div>
                  <p className={styles.parsingText}>Reading your resume…</p>
                  <p className={styles.parsingSubtext}>Extracting text from {fileName}</p>
                </div>
              ) : resume && fileName ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✅</div>
                  <p className={styles.successFileName}>{fileName}</p>
                  <p className={styles.successChars}>{resume.length.toLocaleString()} characters extracted</p>
                  <button className={styles.clearBtn} onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                    Remove & upload another
                  </button>
                </div>
              ) : (
                <div className={styles.idleState}>
                  <div className={styles.uploadIconWrapper}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className={styles.dropTitle}>Drop your resume here</p>
                  <p className={styles.dropSubtitle}>or <span className={styles.browseLink}>click to browse</span></p>
                  <div className={styles.formatBadges}>
                    <span className={styles.formatBadge}>PDF</span>
                    <span className={styles.formatBadge}>DOCX</span>
                    <span className={styles.formatBadge}>TXT</span>
                  </div>
                  <p className={styles.sizeHint}>Max {MAX_FILE_SIZE_MB}MB</p>
                </div>
              )}
            </div>

            {/* Error */}
            {parseErr && (
              <div className={styles.parseError}>
                {parseErr}
                <button className={styles.tryPasteBtn} onClick={() => setInputMode('paste')}>
                  Try pasting instead →
                </button>
              </div>
            )}

            {/* Show extracted text preview if we have it */}
            {resume && !parsing && (
              <div className={styles.extractedPreview}>
                <div className={styles.extractedHeader}>
                  <span>Extracted Text Preview</span>
                  <button className={styles.editTextBtn} onClick={() => setInputMode('paste')}>
                    Edit text →
                  </button>
                </div>
                <div className={styles.extractedText}>{resume.slice(0, 400)}{resume.length > 400 ? '…' : ''}</div>
              </div>
            )}
          </div>
        )}

        {/* PASTE MODE */}
        {inputMode === 'paste' && (
          <div className={panelStyles.textareaWrapper}>
            {fileName && (
              <div className={styles.fileChip}>
                <span>{fileName}</span>
                <button onClick={clearFile} className={styles.chipClear}>×</button>
              </div>
            )}
            <textarea
              className={panelStyles.textarea}
              value={resume}
              onChange={e => onChange(e.target.value)}
              placeholder={`Paste your resume text here…\n\nExample:\nJOHN DOE | john@email.com | linkedin.com/in/johndoe\n\nEXPERIENCE\nSenior Product Manager - Google (2021–Present)\n• Led 3 product launches generating $12M ARR\n• Managed cross-functional team of 15 engineers...`}
              rows={14}
            />
            <div className={panelStyles.charCount}>{resume.length.toLocaleString()} characters</div>
          </div>
        )}

        {/* Actions */}
        <div className={panelStyles.actions}>
          <button
            className="btn-primary"
            onClick={onNext}
            disabled={!resume || resume.length < 30}
            style={{ opacity: (!resume || resume.length < 30) ? 0.5 : 1 }}
          >
            Continue to Job Description
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={panelStyles.sidebar}>
        <div className={panelStyles.tipsCard}>
          <div className={panelStyles.tipsHeader}>Tips for Best Results</div>
          <ul className={panelStyles.tipsList}>
            {TIPS.map(tip => (
              <li key={tip.title} className={panelStyles.tipItem}>
                <span className={panelStyles.tipCheck}>✓</span>
                <div>
                  <strong>{tip.title}</strong>
                  <p>{tip.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <QualityMeter text={resume} type="resume" />
      </div>
    </div>
  );
}
