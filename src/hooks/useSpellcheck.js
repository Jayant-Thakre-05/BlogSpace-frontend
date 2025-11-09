import { useCallback, useState } from 'react';

export default function useSpellcheck({ language = 'en-US' } = {}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(null);

  const check = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('text', text || '');
      params.append('language', language);
      const res = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (!res.ok) throw new Error('Spellcheck request failed');
      const data = await res.json();
      const mapped = (data.matches || []).map((m, i) => ({
        id: `${m.rule?.id || 'r'}-${i}`,
        offset: m.offset,
        length: m.length,
        message: m.message,
        shortMessage: m.shortMessage,
        replacements: (m.replacements || []).map((r) => r.value),
        context: m.context,
        rule: m.rule,
      }));
      setErrors(mapped);
      return mapped;
    } catch (e) {
      setError(e);
      setErrors([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [language]);

  return { check, loading, errors, error };
}
