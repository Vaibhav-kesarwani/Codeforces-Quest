import { useCFStore } from '../../zustand/useCFStore';
import { getValueFromLanguage } from '../helper';
import { loadCodeWithCursor } from '../codeHandlers';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { browserAPI } from '../browser/browserDetect';
import { getDefaultTemplate } from '../services/codeTemplates';

export const useCodeManagement = (
  monacoInstanceRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
) => {
  const setLanguage = useCFStore(state => state.setLanguage);
  const setFontSize = useCFStore(state => state.setFontSize);
  const currentSlug = useCFStore(state => state.currentSlug);

  const handleResetCode = () => {
    if (!currentSlug || !monacoInstanceRef.current) return;

    const model = monacoInstanceRef.current.getModel();
    const language = model?.getLanguageId() || 'cpp';

    const defaultCode =
      localStorage.getItem(language + '_template') || getDefaultTemplate(language);

    if (!localStorage.getItem(language + '_template')) {
      localStorage.setItem(language + '_template', defaultCode);
    }

    loadCodeWithCursor(monacoInstanceRef.current, defaultCode);
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem('preferredLanguage', selectedLanguage);
    const languageValue = getValueFromLanguage(selectedLanguage);

    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    browserAPI.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        func: (languageValue) => {
          const languageSelect = document.querySelector(
            'select[name="programTypeId"]'
          ) as HTMLSelectElement;
          if (languageSelect) {
            languageSelect.value = languageValue;
            const event = new Event('change', { bubbles: true });
            languageSelect.dispatchEvent(event);
          }
        },
        args: [languageValue],
      },
      () => browserAPI.runtime.lastError
    );

    if (monacoInstanceRef.current) {
      monaco.editor.setModelLanguage(
        monacoInstanceRef.current.getModel()!,
        selectedLanguage
      );

      const templateCode =
        localStorage.getItem(selectedLanguage + '_template') ||
        getDefaultTemplate(selectedLanguage);

      loadCodeWithCursor(monacoInstanceRef.current, templateCode);
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFontSize = parseInt(e.target.value, 10);
    setFontSize(selectedFontSize);
    localStorage.setItem('preferredFontSize', selectedFontSize.toString());
    if (monacoInstanceRef.current) {
      monacoInstanceRef.current.updateOptions({ fontSize: selectedFontSize });
    }
  };

  const handleRedirectToLatestSubmission = async () => {
    if (!currentSlug) return;

    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    browserAPI.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        func: () => {
          const anchor = document.querySelector(
            '.roundbox.sidebox .rtable tbody tr td a'
          ) as HTMLAnchorElement;
          if (!anchor) {
            alert('No submission found');
            return;
          }
          window.location.href = anchor.href;
        },
      },
      () => browserAPI.runtime.lastError
    );
  };

  return {
    handleResetCode,
    handleLanguageChange,
    handleFontSizeChange,
    handleRedirectToLatestSubmission,
  };
};
