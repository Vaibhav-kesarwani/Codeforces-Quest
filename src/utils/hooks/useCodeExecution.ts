import { useCFStore } from '../../zustand/useCFStore';
import { adjustCodeForJudge0 } from '../codeAdjustments';
import { EXECUTE_CODE_LIMIT, isProduction } from '../../data/constants';
import { useState } from 'react';
import { usageDataHelper } from '../usageDataHelper';
import { getProblemName } from '../dom/getProblemName';
import { getUserId } from '../dom/getUserId';
import { getTimeLimit } from '../dom/getTimeLimit';
import { getProblemUrl } from '../dom/getProblemUrl';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { safeFetch, getErrorMessage, ApiError } from '../apiErrorHandler';
import { Judge0Result, SubmissionResponse, TestCase, BatchResultsResponse } from '../../types/types';
import { logger } from '../logger';

const languageMap: { [key: string]: number } = {
    'java': 62,
    'javascript': 63,
    'cpp': 54,
    'python': 71,
    'kotlin': 78,
    'go': 106,
    'rust': 73,
    'ruby': 72,
};

const compilerOptionsMap: { [key: string]: string } = {
    'cpp': '-D ONLINE_JUDGE'
};

export const executionState = {
    abortController: null as AbortController | null,
    isExecuting: false,
    reset() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.isExecuting = false;
    },
    startNew() {
        this.reset();
        this.abortController = new AbortController();
        this.isExecuting = true;
        return this.abortController;
    }
};

// Status handler
const handleExecutionStatus = (result: Judge0Result, testCase: TestCase): string => {
    interface StatusHandler {
        message: string | null;
        getOutput: () => string;
    }
    
    const statusHandlers: Record<number, StatusHandler> = {
        2: { message: 'Runtime Error', getOutput: () => result.description ? decodeURIComponent(escape(atob(result.description))) : 'In queue' },
        3: { message: null, getOutput: () => result.stdout ? decodeURIComponent(escape(atob(result.stdout))) : 'No output, please check your code and print something' },
        4: { message: 'Wrong Answer', getOutput: () => result.stdout ? decodeURIComponent(escape(atob(result.stdout))) : 'No output, please check your code and print something' },
        5: { message: 'Time Limit Exceeded', getOutput: () => 'Time Limit Exceeded' },
        6: { message: 'Compilation Error', getOutput: () => `Compilation Error: ${result.compile_output ? decodeURIComponent(escape(atob(result.compile_output))).trim() : 'Compilation Error'}` },
        7: { message: 'Memory Limit Exceeded', getOutput: () => 'Memory Limit Exceeded' },
        8: { message: 'Time Limit Exceeded', getOutput: () => 'Time Limit Exceeded' },
        9: { message: 'Output Limit Exceeded', getOutput: () => 'Output Limit Exceeded' },
        10: { message: 'Runtime Error', getOutput: () => `Runtime Error: ${result.stderr ? decodeURIComponent(escape(atob(result.stderr))).trim() : 'Runtime Error'}` },
        11: { message: 'Runtime Error', getOutput: () => decodeURIComponent(escape(atob(result.stderr || ''))).trim() || 'Runtime Error' },
        12: { message: 'Execution Timed Out', getOutput: () => 'Execution Timed Out' },
    };

    const handler = statusHandlers[result.status_id] || { message: 'Runtime Error', getOutput: () => result.stderr ? decodeURIComponent(escape(atob(result.stderr))).trim() : 'Something went wrong' };
    testCase.ErrorMessage = handler.message;
    return handler.getOutput();
};

// Time and memory handler
const getTimeAndMemory = (result: Judge0Result): { Time: string; Memory: string } => {
    if (result.status_id === 3) {
        return {
            Time: result.time || '0',
            Memory: result.memory ? (result.memory / 1024).toFixed(2) : '0'
        };
    }
    return { Time: '0', Memory: '0' };
};

export const useCodeExecution = (editor: monaco.editor.IStandaloneCodeEditor | null) => {
    const language = useCFStore(state => state.language);
    const testCases = useCFStore(state => state.testCases);
    const setIsRunning = useCFStore(state => state.setIsRunning);
    const [showApiLimitAlert, setShowApiLimitAlert] = useState(false);

    const resetStates = () => {
        setIsRunning(false);
    };

    const handleApiError = (error: ApiError) => {
        logger.error('API Error:', error);
        
        // Handle rate limit errors
        if (error.code === 'RATE_LIMIT' || error.message.includes('Rate Limit') || error.message.includes('Insufficie')) {
            setShowApiLimitAlert(true);
            testCases.ErrorMessage = "Rate Limit Exceeded";
            testCases.testCases.forEach((testCase: TestCase) => {
                testCase.Output = "Rate Limit Exceeded. Please wait or upgrade your API plan.";
                testCase.TimeAndMemory = { Time: '0', Memory: '0' };
            });
            return;
        }

        // Handle network errors
        if (error.code === 'NETWORK_ERROR') {
            testCases.ErrorMessage = "Network Error";
            testCases.testCases.forEach((testCase: TestCase) => {
                testCase.Output = "No internet connection. Please check your network and try again.";
                testCase.TimeAndMemory = { Time: '0', Memory: '0' };
            });
            return;
        }

        // Handle timeout errors
        if (error.code === 'TIMEOUT') {
            testCases.ErrorMessage = "Request Timeout";
            testCases.testCases.forEach((testCase: TestCase) => {
                testCase.Output = "Request timed out. The server is taking too long to respond.";
                testCase.TimeAndMemory = { Time: '0', Memory: '0' };
            });
            return;
        }

        // Handle HTTP errors
        if (error.code === 'HTTP_ERROR') {
            testCases.ErrorMessage = `Server Error (${error.status || 'Unknown'})`;
            testCases.testCases.forEach((testCase: TestCase) => {
                testCase.Output = getErrorMessage(error);
                testCase.TimeAndMemory = { Time: '0', Memory: '0' };
            });
            return;
        }

        // Generic error
        testCases.ErrorMessage = "Execution Error";
        testCases.testCases.forEach((testCase: TestCase) => {
            testCase.Output = getErrorMessage(error);
            testCase.TimeAndMemory = { Time: '0', Memory: '0' };
        });
    };

    const setCatchError = (error: Error | ApiError | DOMException) => {
    // Handle abort errors
    if ('name' in error && error.name === 'AbortError') {
        resetStates();
        return;
    }

    // Check for network errors (TypeError usually means network issue)
    if (error instanceof TypeError || ('name' in error && error.name === 'TypeError')) {
        const errorMsg = (error.message || '').toLowerCase();
        if (errorMsg.includes('fetch') || 
            errorMsg.includes('network') || 
            errorMsg.includes('failed') ||
            errorMsg.includes('internet')) {
            handleApiError({
                message: 'Network error. Please check your internet connection.',
                code: 'NETWORK_ERROR'
            });
            return;
        }
    }

    // Convert legacy error handling to new format
    if (error.message?.includes("Insufficie") || error.message?.includes("Rate Limit")) {
        handleApiError({
            message: error.message,
            code: 'RATE_LIMIT',
            status: 429
        });
        return;
    }

    // Generic error fallback
    handleApiError({
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        details: error
    });
};

    const createSubmissionPayload = (code: string, input: string, timeLimit: number) => ({
        language_id: languageMap[language],
        source_code: btoa(adjustCodeForJudge0({ code, language })),
        stdin: btoa(input),
        cpu_time_limit: timeLimit,
        compiler_options: compilerOptionsMap[language] || null,
    });

    const processResults = async (tokens: string[], apiKey: string, region: string = 'AUTO'): Promise<BatchResultsResponse> => {
        const controller = executionState.startNew();
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, (language === 'kotlin' ? 6000 : EXECUTE_CODE_LIMIT) * testCases.testCases.length);
            controller.signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });

        const endpoint = `https://ce.judge0.com/submissions/batch?base64_encoded=true&tokens=${tokens.join(',')}&fields=stdout,stderr,status,compile_output,status_id,time,memory`;
        
        const { data, error } = await safeFetch<BatchResultsResponse>(
            endpoint,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Judge0-Region': region,
                    'Authorization': apiKey ? `Bearer ${apiKey}` : ''
                },
                signal: controller.signal
            },
            30000
        );

        if (error) {
            throw error;
        }

        return data as BatchResultsResponse;
    };

    const executeCodeCE = async (code: string, apiKey: string, timeLimit: number) => {
        const submissions = testCases.testCases.map(testCase => 
            createSubmissionPayload(code, testCase.Input, timeLimit)
        );

        try {
            const controller = executionState.startNew();
            
            // Submit batch request
            const { data: batchResponse, error: submitError } = await safeFetch(
                'https://judge0-ce.p.sulu.sh/submissions/batch?base64_encoded=true',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': apiKey ? `Bearer ${apiKey}` : ''
                    },
                    body: JSON.stringify({ submissions }),
                    signal: controller.signal
                },
                30000
            );

            // Handle submission errors
            if (submitError) {
                handleApiError(submitError);
                return;
            }

            // Validate batch response
            if (!batchResponse || !Array.isArray(batchResponse)) {
                const errorDetail = (batchResponse as { error?: string })?.error || 'Invalid response from Judge0';
                testCases.ErrorMessage = 'Compilation Error';
                testCases.testCases.forEach((testCase: TestCase) => {
                    testCase.Output = errorDetail;
                    testCase.TimeAndMemory = { Time: '0', Memory: '0' };
                });
                return;
            }

            const tokens = batchResponse.map((submission: SubmissionResponse) => submission.token);
            let results = await processResults(tokens, apiKey, 'AUTO');

            if (!results?.submissions) {
                testCases.ErrorMessage = 'Compilation Error';
                const errorDetail = (results as { error?: string })?.error 
                    ? decodeURIComponent(escape(atob((results as { error: string }).error))) 
                    : 'Failed to get results';
                testCases.testCases.forEach((testCase: TestCase) => {
                    testCase.Output = errorDetail;
                    testCase.TimeAndMemory = { Time: '0', Memory: '0' };
                });
                return;
            }

            const outputResults: string[] = [];
            const timeMemoryResults: { Time: string; Memory: string }[] = [];

            for (const result of results.submissions) {
                if (!result) continue;

                if (result?.status_id === 2) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    results = await processResults(tokens, apiKey);
                }

                timeMemoryResults.push(getTimeAndMemory(result));
                outputResults.push(handleExecutionStatus(result, testCases.testCases[timeMemoryResults.length - 1]));
            }

            testCases.testCases.forEach((testCase: TestCase, index: number) => {
                testCase.Output = outputResults[index];
                testCase.TimeAndMemory = timeMemoryResults[index];
            });

        } catch (error: unknown) {
            setCatchError(error as Error | ApiError | DOMException);
        }
    };

    const executeCode = async (code: string, apiKey: string, timeLimit: number) => {
        try {
            await executeCodeCE(code, apiKey, timeLimit);
        } catch (error: unknown) {
            setCatchError(error as Error | ApiError | DOMException);
        }
    };

    const runCode = async () => {
        if (!editor) {
            alert("Wait for editor to load");
            return;
        }
        
        const problemName = await getProblemName();
        const userId = await getUserId();
        const timeLimit = await getTimeLimit();
        const problemUrl = await getProblemUrl();

        if (userId.includes("Unknown")) {
            alert("Please login to run code");
            return;
        }
        
        setIsRunning(true);
        testCases.ErrorMessage = '';
        testCases.testCases.forEach((testCase: TestCase) => {
            testCase.Output = '';
            testCase.TimeAndMemory = { Time: '0', Memory: '0' };
        });

        const code = editor.getValue();
        const apiKey = localStorage.getItem('judge0CEApiKey');

        if (!code) {
            testCases.ErrorMessage = 'No code provided';
            setIsRunning(false);
            return;
        }

        await executeCode(code, apiKey || "", timeLimit);

        setIsRunning(false);

        if (isProduction) {
            await usageDataHelper(language, testCases, userId).handleUsageData(
                code, 
                problemUrl, 
                "RUN", 
                problemName
            );
        }
    };

    return {
        runCode,
        showApiLimitAlert,
        setShowApiLimitAlert
    };
};