import { useRef, useEffect, useState } from 'react';
import { useCFStore } from '../../zustand/useCFStore';
import { formatCode, getCodeMap, getSlug } from '../../utils/helper';
import { getDefaultTemplate } from '../../utils/services/codeTemplates';
import TopBar from './editor/TopBar';
import TestCases from './testcases/TestCases';
import { ResizablePanel } from '../global/ResizablePanel';
import { useCodeExecution } from '../../utils/hooks/useCodeExecution';
import { useCodeManagement } from '../../utils/hooks/useCodeManagement';
import { useTestCases } from '../../utils/hooks/useTestCases';
import { useTabEvents } from '../../utils/hooks/useTabEvents';
import { handleSubmission } from '../../utils/services/submissionService';
import { initializeStorage } from '../../utils/services/storageService';
import { loadCodeWithCursor } from '../../utils/codeHandlers';
import { accessRestrictionMessage } from '../../data/constants';
import ApiLimitAlert from '../global/popups/ApiLimitAlert';
import CodeEditor from './editor/CodeEditor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { browserAPI } from '../../utils/browser/browserDetect';

interface MainProps {
    setShowOptions: (show: boolean) => void;
    theme: string;
}

const Main: React.FC<MainProps> = ({ setShowOptions, theme }) => {
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    // Zustand store hooks
    const {
        language,
        fontSize,
        currentSlug,
        setCurrentSlug,
        setCurrentUrl,
        setTotalSize,
        testCases,
        isRunning,
        isSubmitting,
        setIsSubmitting
    } = useCFStore();

    // Custom hooks
    const { runCode, showApiLimitAlert, setShowApiLimitAlert } = useCodeExecution(monacoInstanceRef.current);
    const { handleResetCode, handleLanguageChange, handleFontSizeChange, handleRedirectToLatestSubmission } = useCodeManagement(monacoInstanceRef);
    const { loadTestCases, setupTestCaseListener } = useTestCases();
    const { handleTabEvents } = useTabEvents();
    const [isFormating, setIsFormating] = useState(false);

    // Load current slug and code
    useEffect(() => {
        const getCurrentSlug = async () => {
            const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
            if (!tab?.url) return;

            const newSlug = getSlug(tab.url);
            setCurrentSlug(newSlug);
            setCurrentUrl(tab.url);

            if (!newSlug) {
                setTimeout(() => loadCodeWithCursor(monacoInstanceRef.current, accessRestrictionMessage), 500);
                return;
            }

            const codeFromMap = getCodeMap().get(newSlug)?.code || '';
            const templateCode = localStorage.getItem(language + "_template") || getDefaultTemplate(language);
            const codeToLoad = codeFromMap || templateCode;

            setTimeout(() => loadCodeWithCursor(monacoInstanceRef.current, codeToLoad), 500);
            loadTestCases({ slug: newSlug });
        };

        setTimeout(getCurrentSlug, 100);
    }, [language]);

    // Reload code when slug or language changes
    useEffect(() => {
        if (!currentSlug) return;

        const codeFromMap = getCodeMap().get(currentSlug)?.code || '';
        const templateCode = localStorage.getItem(language + "_template") || getDefaultTemplate(language);
        const codeToLoad = codeFromMap || templateCode;

        loadCodeWithCursor(monacoInstanceRef.current, codeToLoad);
    }, [currentSlug, language]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                handleSubmission(monacoInstanceRef.current, setIsSubmitting, language, testCases);
            }
            if (event.ctrlKey && event.key === "'") {
                if (!currentSlug) {
                    alert('Please select a problem to run code.');
                    return;
                }
                runCode();
            }
        };
        document.addEventListener('keydown', handleKeyPress, true);
        return () => document.removeEventListener('keydown', handleKeyPress, true);
    }, [currentSlug, runCode]);

    // Editor readOnly toggle
    useEffect(() => {
        if (monacoInstanceRef.current) {
            monacoInstanceRef.current.updateOptions({ readOnly: !currentSlug });
        }
    }, [currentSlug]);

    // Tab events listener
    useEffect(() => {
        const listener = (message: any, sender: any, sendResponse: (response: any) => void) => {
            return handleTabEvents(message, sender, sendResponse, monacoInstanceRef.current);
        };
        browserAPI.runtime.onMessage.addListener(listener);
        return () => browserAPI.runtime.onMessage.removeListener(listener);
    }, [currentSlug, testCases]);

    // Storage & testcases setup
    useEffect(() => {
        const cleanup = setupTestCaseListener();
        const size = initializeStorage();
        setTotalSize(size);
        return cleanup;
    }, []);

    return (
        <div className='flex flex-col w-full justify-start items-center h-full dark:bg-[#111111]'>
            <ApiLimitAlert
                isOpen={showApiLimitAlert}
                setIsOpen={setShowApiLimitAlert}
            />
            <TopBar
                theme={theme as "light" | "dark"}
                handleClick={() => handleSubmission(monacoInstanceRef.current, setIsSubmitting, language, testCases)}
                setShowOptions={setShowOptions}
                language={language}
                handleLanguageChange={handleLanguageChange}
                fontSize={fontSize}
                handleFontSizeChange={handleFontSizeChange}
                handleResetCode={handleResetCode}
                handleRedirectToLatestSubmission={handleRedirectToLatestSubmission}
                currentSlug={currentSlug}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                runCode={runCode}
                testCases={testCases.testCases}
                isFormating={isFormating}
                handleFormatCode={() => formatCode(monacoInstanceRef, language,  setIsFormating)}
            />

            <div className="w-full h-[calc(100vh-88px)]">
                <ResizablePanel
                    top={
                        <CodeEditor
                            monacoInstanceRef={monacoInstanceRef}
                            language={language}
                            fontSize={fontSize}
                            templateCode={localStorage.getItem(language + "_template") || getDefaultTemplate(language)}
                        />
                    }
                    bottom={<TestCases />}
                    initialHeight={70}
                />
            </div>
        </div>
    );
};
export default Main;
