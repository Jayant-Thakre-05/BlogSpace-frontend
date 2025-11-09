import { useMemo, useState } from 'react';
import useSpellcheck from '../hooks/useSpellcheck';

export default function SpellcheckHelper({ value, onChangeValue, label = 'Text', language = 'en-US', showPreview = false }) {
  const { check, loading, errors, error } = useSpellcheck({ language });
  const [corrected, setCorrected] = useState('');

  const handleCheck = async () => {
    const matches = await check(value || '');
    if (showPreview) {
      // build corrected text automatically after checking
      const current = value || '';
      if (!current) {
        setCorrected('');
        return;
      }
      if (!matches || matches.length === 0) {
        setCorrected(current);
        return;
      }
      const sorted = [...matches].sort((a, b) => a.offset - b.offset);
      let result = '';
      let cursor = 0;
      for (const m of sorted) {
        const rep = (m.replacements && m.replacements[0]) || null;
        const start = m.offset;
        const end = m.offset + m.length;
        if (cursor < start) result += current.slice(cursor, start);
        if (rep) {
          result += rep;
        } else {
          result += current.slice(start, end);
        }
        cursor = end;
      }
      if (cursor < current.length) result += current.slice(cursor);
      setCorrected(result);
    }
  };

  const items = useMemo(() => errors || [], [errors]);

  const applyReplacement = (offset, length, replacement) => {
    const current = value || '';
    const before = current.slice(0, offset);
    const after = current.slice(offset + length);
    onChangeValue(before + replacement + after);
  };

  const applyCorrected = () => {
    onChangeValue(corrected || '');
  };

  return (
    <div className="spellcheck">
      <div className="ai-toolbar" style={{ marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={handleCheck} disabled={loading}>
          {loading ? 'Checking…' : `Check ${label}`}
        </button>
        {error && <span className="text-danger">Spellcheck failed</span>}
        {!loading && !error && items.length > 0 && (
          <span className="text-muted">{items.length} issue(s) found</span>
        )}
        {!loading && !error && items.length === 0 && value && (
          <span className="text-success">No issues</span>
        )}
      </div>

      {items.length > 0 && (
        <div className="issues" style={{ marginTop: 8 }}>
          {items.map((m) => (
            <div key={m.id} className="issue">
              <div className="message">{m.message}</div>
              <div className="context">
                {m.context?.text ? (
                  <>
                    {m.context.text.slice(0, m.context.offset)}
                    <strong>{m.context.text.slice(m.context.offset, m.context.offset + m.context.length)}</strong>
                    {m.context.text.slice(m.context.offset + m.context.length)}
                  </>
                ) : null}
              </div>
              <div className="pills">
                {(m.replacements || []).slice(0, 5).map((r, idx) => (
                  <span
                    key={idx}
                    className="pill"
                    onClick={() => applyReplacement(m.offset, m.length, r)}
                    role="button"
                    tabIndex={0}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPreview && (
        <div className="corrected-box">
          {corrected && corrected !== value && (
            <div className="header">
              <button type="button" className="btn btn-secondary" onClick={applyCorrected}>
                Use corrected {label}
              </button>
            </div>
          )}
          <textarea
            className="textarea corrected-textarea"
            placeholder={`Corrected ${label}`}
            value={corrected}
            onChange={(e) => setCorrected(e.target.value)}
            rows={8}
          />
        </div>
      )}
    </div>
  );
}
